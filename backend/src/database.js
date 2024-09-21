import mysql from "mysql2/promise";

export const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root8888",
    database: "high-street-gym",
});