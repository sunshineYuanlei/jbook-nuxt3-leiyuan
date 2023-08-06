/**
 * 1、判断用户是否登录
 * 2、上传头像到腾讯云, 并存储上传头像路径到数据库中
 */

import { getDB } from "~/server/utils/db/mysql"
import { getLoginUid, responseJson } from "~/server/utils/helper"
// @ts-ignore
import COS from "cos-nodejs-sdk-v5"
import { getUUID } from "~/composables/useHelper"

export default defineEventHandler(async (event) => {
  //判断用户登录
  let uid = getLoginUid(event)
  console.log("uid", uid)
  if (uid === 0) {
    // @ts-ignore
    setResponseStatus(event, 401)
    return responseJson(1, "请先登录", {})
  }

  //获取数据
  const body = await readMultipartFormData(event)
  console.log("body-image-upload", body)

  if (body) {
    let { type = "", filename = "", data: buffer = "" } = body[0]

    // 数据校验
    const types = ["image/jpeg", "image/jpg", "image/png"]
    if (!types.includes(type)) {
      return responseJson(1, "请上传jpg/png/jpeg类型的图片", {})
    }

    // 图片上传到腾讯云
    const config = useRuntimeConfig()

    // 初始化cos
    const cos = new COS({
      SecretId: config.SecretId,
      SecretKey: config.SecretKey,
    })

    // 图片后缀
    const ext = filename.slice(filename.lastIndexOf(".") + 1)
    // 请求key
    const key = `uploads/${uid}/avatar/${getUUID()}.${ext}`

    // 请求文件
    const data = await cos.putObject({
      Bucket: config.public.BUCKET /* 必须 */,
      Region: config.public.REGION /* 必须 */,
      Key: key /* 必须 */,
      Body: buffer, // 上传文件对象
    })
    console.log("data-cos", data)
    // 存储图片路径
    const avatarUrl = `https://${data.Location}`

    // 图片插入数据库
    const con = getDB()
    try {
      // 插入users
      const [rows] = await con.execute(
        "UPDATE `users` SET `avatar`=? WHERE `id`=?",
        [avatarUrl, uid]
      )
      // 释放连接
      await con.end()
      if (rows.affectedRows === 0) {
        return responseJson(1, "上传头像失败~", {})
      }
      return responseJson(0, "上传头像成功~", {
        avatar: avatarUrl,
      })
    } catch (e) {
      // 释放连接
      await con.end()
      console.log("error=>", e)
      setResponseStatus(event, 501)
      return responseJson(1, "服务器错误", {})
    }
  }

  return responseJson(1, "请上传图片~", {})
})
