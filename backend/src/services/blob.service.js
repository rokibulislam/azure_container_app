import {
  BlobServiceClient,
  BlobSASPermissions,
  generateBlobSASQueryParameters
} from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';
import { randomUUID } from 'crypto';
import path from 'path';
import { config } from '../config.js';

function getBlobServiceClient() {
  if (config.storage.useManagedIdentity) {
    return new BlobServiceClient(
      `https://${config.storage.accountName}.blob.core.windows.net`,
      new DefaultAzureCredential()
    );
  }

  return BlobServiceClient.fromConnectionString(
    config.storage.connectionString
  );
}

const blobServiceClient = getBlobServiceClient();

function getUploadsContainerClient() {
  return blobServiceClient.getContainerClient(
    config.storage.uploadsContainer
  );
}

export async function uploadPrivateFile({
  buffer,
  originalFilename,
  contentType
}) {
  const ext = path.extname(originalFilename || '');
  const blobName = `${randomUUID()}${ext}`;

  const containerClient = getUploadsContainerClient();
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: contentType || 'application/octet-stream'
    }
  });

  return { blobName };
}

export async function generateReadUrl(blobName, expiresInMinutes = 15) {
  const containerClient = getUploadsContainerClient();
  const blobClient = containerClient.getBlobClient(blobName);

  const expiresOn = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  const delegationKey = await blobServiceClient.getUserDelegationKey(
    new Date(),
    expiresOn
  );

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: config.storage.uploadsContainer,
      blobName,
      permissions: BlobSASPermissions.parse('r'),
      startsOn: new Date(),
      expiresOn
    },
    delegationKey,
    config.storage.accountName
  ).toString();

  return `${blobClient.url}?${sasToken}`;
}