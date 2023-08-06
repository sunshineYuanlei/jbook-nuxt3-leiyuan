/**
 * 1、判断用户是否登录
 * 2、已登录则获取用户文集下的文章
 */

import { getDB } from "~/server/utils/db/mysql"
import { getLoginUid, responseJson } from "~/server/utils/helper"
// @ts-ignore
import Joi from "joi"

export default defineEventHandler(async (event) => {
  // 判断用户登录
  let uid = getLoginUid(event)
  console.log("uid", uid)
  if (uid === 0) {
    setResponseStatus(event, 401)
    return responseJson(1, "请先登录", {})
  }

  // 获取数据
  const params = await getQuery(event)
  console.log("params", params)

  // 校验数据joi
  const schema = Joi.object({ notebookId: Joi.number().required() })

  try {
    await schema.validateAsync(params)
  } catch (e) {
    return responseJson(1, "参数错误", {})
  }

  const con = getDB()

  try {
    // 查询文章和文集的关联表筛选关联文章
    const [rows_nodebook_notes] = await con.query(
      "SELECT `note_id` FROM `notebook_notes` WHERE `notebook_id`=?",
      [params.notebookId]
    )
    console.log("rows_nodebook_notes", rows_nodebook_notes)

    if (!rows_nodebook_notes.length) {
      return responseJson(0, "无数据", { list: [] })
    }

    // 查询文章
    let nodeIdList: [] = rows_nodebook_notes.map((v: any) => v.note_id)

    // 查询文章表
    const [rows] = await con.query(
      "SELECT id,title FROM `notes` WHERE `uid`=? AND id IN (?) ORDER BY `id` DESC",
      [uid, nodeIdList]
    )
    console.log("rows=>", rows)
    // 释放连接
    await con.end()

    return responseJson(0, "获取文章成功", { list: rows })
  } catch (e) {
    //释放连接
    await con.end()
    console.log("error", e)
    setResponseStatus(event, 500)
    return responseJson(1, "服务器错误", {})
  }
})
