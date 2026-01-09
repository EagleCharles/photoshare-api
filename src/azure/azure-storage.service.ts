import { Injectable } from '@nestjs/common';
import { BlobServiceClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class AzureStorageService {
  private readonly containerName = process.env.AZURE_CONTAINER_NAME || 'app-photos';
  private readonly blobServiceClient: BlobServiceClient;

  constructor() {
    const rawConnection = process.env.AZURE_STORAGE_CONNECTION_STRING;
    
    if (!rawConnection) {
      throw new Error('AZURE_STORAGE_CONNECTION_STRING not set');
    }

    // FIX: This removes any accidental spaces, newlines, or quotes 
    // that cause the "Signature did not match" (403) error.
    const cleanConnectionString = rawConnection.trim().replace(/["']/g, "");

    this.blobServiceClient = BlobServiceClient.fromConnectionString(cleanConnectionString);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const containerClient = this.blobServiceClient.getContainerClient(this.containerName);

    // Note: createIfNotExists is removed to bypass administrative 403 errors.
    // Ensure the container 'app-photos' exists in your Azure Portal.

    const ext = path.extname(file.originalname);
    const blobName = `${uuidv4()}${ext}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload file buffer
    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });

    // Return the public URL of the uploaded blob
    return blockBlobClient.url;
  }
}