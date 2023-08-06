import mysql from "mysql2"

//连接池
export const getDB = () => {
  const config = useRuntimeConfig()
  return mysql
    .createPool({
      // host: "172.28.160.1",
      host: config.DB_HOST,
      user: config.DB_USER,
      database: config.DB_DATABASE,
      password: config.DB_PASSWORD,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
    .promise()


