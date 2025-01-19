import mysql from "mysql2/promise";
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "chat-app",
});

export async function Execute(query = "", values = []) {
  try {
    if (!pool) throw new Error("connection failed..!");
    const [result] = await pool.execute(query, values);
    return result;
  } catch (error) {
    throw new Error("Connection failed : " + error.message);
  }
}
