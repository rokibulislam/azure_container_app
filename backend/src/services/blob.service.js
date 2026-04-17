import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions
} from '@azure/storage-blob';
import { DefaultAzureCredential, ClientSecretCredential } from '@azure/identity';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config.js';

function buildCredential() {
  if (config.storage.useManagedIdentity) {
    return new DefaultAzureCredential();
  }

  if (config.storage.tenantId && config.storage.clientId && config.storage.clientSecret) {
    return new ClientSecretCredential(
      config.storage.tenantId,
      config.storage.clientId,
      config.storage.clientSecret
    );
  }

  return null;
}

function getBlobServiceClient() {
  if (config.storage.connectionString) {
    return BlobServiceClient.fromConnectionString(config.storage.connectionString);
  }

  const credential = buildCredential();
  if (!credential) {
    throw new Error('No Azure Blob credential configuration is available');
  }

  return new BlobServiceClient(
    `https://${config.storage.accountName}.blob.core.windows.net`,
    credential
  );
}

function getSharedKeyCredential() {
  const accountKey = process.env.STORAGE_ACCOUNT_KEY;
  if (!accountKey) return null;
  return new StorageSharedKeyCredential(config.storage.accountName, accountKey);
}

export async function uploadPrivateFile({ buffer, originalFilename, contentType }) {
  const blobServiceClient = getBlobServiceClient();
  const containerClient = blobServiceClient.getContainerClient(config.storage.uploadsContainer);
  await containerClient.createIfNotExists();

  const safeName = originalFilename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const blobName = `${new Date().toISOString().slice(0, 10)}/${uuidv4()}-${safeName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: contentType || 'application/octet-stream'
    }
  });

  return { blobName };
}

export async function generateReadUrl(blobName, expiresInMinutes = 15) {
  const blobServiceClient = getBlobServiceClient();
  const containerClient = blobServiceClient.getContainerClient(config.storage.uploadsContainer);
  const blobClient = containerClient.getBlobClient(blobName);

  const sharedKey = getSharedKeyCredential();
  if (sharedKey) {
    const expiresOn = new Date(Date.now() + expiresInMinutes * 60 * 1000);
    const sas = generateBlobSASQueryParameters(
      {
        containerName: config.storage.uploadsContainer,
        blobName,
        permissions: BlobSASPermissions.parse('r'),
        startsOn: new Date(Date.now() - 60 * 1000),
        expiresOn
      },
      sharedKey
    ).toString();

    return `${blobClient.url}?${sas}`;
  }

  const credential = buildCredential();
  if (!credential) {
    throw new Error('Cannot generate SAS without a valid Azure credential');
  }

  const delegationKey = await blobServiceClient.getUserDelegationKey(
    new Date(Date.now() - 5 * 60 * 1000),
    new Date(Date.now() + expiresInMinutes * 60 * 1000)
  );

  const sas = generateBlobSASQueryParameters(
    {
      containerName: config.storage.uploadsContainer,
      blobName,
      permissions: BlobSASPermissions.parse('r'),
      startsOn: new Date(Date.now() - 60 * 1000),
      expiresOn: new Date(Date.now() + expiresInMinutes * 60 * 1000)
    },
    delegationKey,
    config.storage.accountName
  ).toString();

  return `${blobClient.url}?${sas}`;
}