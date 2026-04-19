import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const useManagedIdentity =
  String(process.env.SQL_USE_MANAGED_IDENTITY || 'false') === 'true';

const baseConfig = {
  server: process.env.SQL_SERVER_FQDN,
  database: process.env.SQL_DATABASE_NAME,
  port: Number(process.env.SQL_PORT || 1433),
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

const config = useManagedIdentity
  ? {
      ...baseConfig,
      authentication: {
        type: 'azure-active-directory-default'
      }
    }
  : {
      ...baseConfig,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD
    };

async function testConnection() {
  try {
    console.log('Connecting to Azure SQL...');
    console.log(
      `Auth mode: ${
        useManagedIdentity ? 'Managed Identity' : 'SQL Username/Password'
      }`
    );

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