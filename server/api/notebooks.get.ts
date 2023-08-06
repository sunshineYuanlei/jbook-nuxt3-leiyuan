// 获取用户文集

import { getDB } from "~/server/utils/db/mysql"
import { getLoginUid, responseJson } from "~/server/utils/helper"

export default defineEventHandler(async (event) => {
  const con = getDB()
  try {
    // 获取用户文集
    const [rows] = await con.execute("select * from `notebooks`")
    console.log("get-all-notebooks", rows)
    // 释放连接
    await con.end()
    return responseJson(0, "获取用户文集成功", { list: rows })
  } catch (e) {
    // 释放连接
    await con.end()
    console.log("error", e)
    setResponseStatus(event, 500)
    return responseJson(1, "服务器错误", {})
  }
})
