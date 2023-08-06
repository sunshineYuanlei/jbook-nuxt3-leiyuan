import { getDB } from "~/server/utils/db/mysql"
import { responseJson } from "~/server/utils/helper"

export default defineEventHandler(async (event) => {
  // 获取数据
  const params = await getQuery(event)
  console.log("params", params)

  const con = getDB()
  try {
    // 分页获取全部文章
    const [rows] = await con.query(
      "SELECT * FROM `notes` LIMIT ? OFFSET ?",
      // @ts-ignore
      [Number(params.pageSize), (params.page - 1) * params.pageSize]
    )
    console.log("11111", rows)
    //释放连接
    await con.end()

    return responseJson(0, "获取所有文章成功", {
      list: rows,
    })
  } catch (e) {
    //释放连接
    await con.end()
    console.log("error", e)
    setResponseStatus(event, 500)
    return responseJson(1, "服务器错误", {})
  }
})
