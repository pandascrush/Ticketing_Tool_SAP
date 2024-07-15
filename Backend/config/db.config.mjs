// config/db.config.mjs
import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

export default connection;
