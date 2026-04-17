import dotenv from 'dotenv';

dotenv.config();

function getRequired(name, fallback = undefined) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT || 2000),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'https://sttaskmgrdevo1q8y5.z7.web.core.windows.net',
  jwtSecret: getRequired('JWT_SECRET', 'replace-this-for-local-dev'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  sql: {
    server: getRequired('SQL_SERVER_FQDN'),
    database: getRequired('SQL_DATABASE_NAME'),
    port: Number(process.env.SQL_PORT || 1433),
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    useManagedIdentity: String(process.env.SQL_USE_MANAGED_IDENTITY || 'false') === 'true'
  },

  storage: {
    accountName: getRequired('STORAGE_ACCOUNT_NAME'),
    staticContainer: process.env.STATIC_CONTAINER_NAME || 'static',
    uploadsContainer: process.env.UPLOADS_CONTAINER_NAME || 'uploads-private',
    useManagedIdentity: String(process.env.STORAGE_USE_MANAGED_IDENTITY || 'false') === 'true',
    connectionString: process.env.STORAGE_CONNECTION_STRING,
    tenantId: process.env.AZURE_TENANT_ID,
    clientId: process.env.AZURE_CLIENT_ID,
    clientSecret: process.env.AZURE_CLIENT_SECRET
  }
};