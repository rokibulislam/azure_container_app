import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  server: process.env.SQL_SERVER_FQDN,
  database: process.env.SQL_DATABASE_NAME,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  port: Number(process.env.SQL_PORT || 1433),
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

async function testConnection() {
  try {
    console.log('Connecting to Azure SQL...');
    const pool = await sql.connect(config);

    console.log('✅ Connected successfully');

    const result = await pool.request().query('SELECT GETDATE() AS now');

    console.log('DB Time:', result.recordset[0]);

    await pool.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection failed');
    console.error(err.message);
    process.exit(1);
  }
}

testConnection();