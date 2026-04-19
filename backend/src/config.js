import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 2000),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'https://sttaskmgrdevo1q8y5.z7.web.core.windows.net',
  // corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',

  jwtSecret: process.env.JWT_SECRET || 'change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  sql: {
    server: process.env.SQL_SERVER_FQDN,
    database: process.env.SQL_DATABASE_NAME,
    port: Number(process.env.SQL_PORT || 1433),
    useManagedIdentity:
      String(process.env.SQL_USE_MANAGED_IDENTITY || 'false') === 'true',

    // only for local dev
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD
  },

  storage: {
    accountName: process.env.STORAGE_ACCOUNT_NAME,
    staticContainer: process.env.STATIC_CONTAINER_NAME || 'static',
    uploadsContainer: process.env.UPLOADS_CONTAINER_NAME || 'uploads-private',
    useManagedIdentity:
      String(process.env.STORAGE_USE_MANAGED_IDENTITY || 'true') === 'true',

    // only for local dev
    connectionString: process.env.STORAGE_CONNECTION_STRING
  }
};