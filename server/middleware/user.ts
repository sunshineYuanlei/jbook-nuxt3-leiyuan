import { getDB } from "~/server/utils/db/mysql"

export default defineEventHandler(async () => {
  const [rows, fields] = await getDB().query("select * from `users`")
  console.log("rows>>>", rows, fields)
})
