import sql from 'mssql';
import { config } from '../config.js';

let poolPromise;

function buildSqlConfig() {
  const baseConfig = {
    server: config.sql.server,
    database: config.sql.database,
    port: config.sql.port,
    options: {
      encrypt: true,
      trustServerCertificate: false
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
  };

  if (config.sql.useManagedIdentity) {
    return {
      ...baseConfig,
      authentication: {
        type: 'azure-active-directory-default'
      }
    };
  }

  return {
    ...baseConfig,
    user: config.sql.user,
    password: config.sql.password
  };
}

export async function getPool() {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(buildSqlConfig())
      .connect()
      .then((pool) => {
        console.log(
          `Connected to Azure SQL using ${
            config.sql.useManagedIdentity
              ? 'Managed Identity'
              : 'SQL credentials'
          }`
        );
        return pool;
      })
      .catch((err) => {
        poolPromise = undefined;
        throw err;
      });
  }

  return poolPromise;
}

export async function testDbConnection() {
  const pool = await getPool();
  const result = await pool.request().query('SELECT 1 AS ok');
  return result.recordset[0];
}

export { sql };