const sql = require("mssql");
require("dotenv").config();

// DB ITMIS
const dbITMISConfig = {
  user: process.env.DB_ITMIS_USER,
  password: process.env.DB_ITMIS_PASSWORD,
  server: process.env.DB_ITMIS_SERVER,
  database: process.env.DB_ITMIS_DATABASE,
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: false,
  },
};

// DB YET Organization
const dbYETConfig = {
  user: process.env.DB_YET_USER,
  password: process.env.DB_YET_PASSWORD,
  server: process.env.DB_YET_SERVER,
  database: process.env.DB_YET_DATABASE,
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: false,
  },
};

// สร้าง Connection Pool
const poolITMIS = new sql.ConnectionPool(dbITMISConfig)
  .connect()
  .then(pool => {
    console.log("✅ Connected to ITMIS DB");
    return pool;
  })
  .catch(err => {
    console.error("❌ ITMIS DB Error:", err);
    throw err;
  });

const poolYET = new sql.ConnectionPool(dbYETConfig)
  .connect()
  .then(pool => {
    console.log("✅ Connected to YET DB");
    return pool;
  })
  .catch(err => {
    console.error("❌ YET DB Error:", err);
    throw err;
  });

module.exports = {
  sql,
  poolITMIS,
  poolYET,
};