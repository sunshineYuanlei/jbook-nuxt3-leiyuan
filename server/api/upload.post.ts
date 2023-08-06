/**
 * 1、判断用户是否登录
 * 2、已登录则上传图片
 */

import { getDB } from "~/server/utils/db/mysql"
import { getLoginUid, responseJson } from "~/server/utils/helper"
import * as fs from "fs"
// @ts-ignore
import path from "path"

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

    // 图片存储
    // 图片名称
    filename = `${Date.now()}-${filename}`
    // 图片路径
    const filepath = path.join("./public", "img", filename)
    fs.writeFile(filepath, buffer, (err) => {
      if (err) {
        console.log(err)
      } else {
      }
    })

    // 图片插入数据库
    const con = getDB()
    try {
      // 存储图片路径
      const avatarUrl = "/img/" + filename
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
