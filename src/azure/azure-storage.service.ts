import { Injectable } from '@nestjs/common';
import { BlobServiceClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class AzureStorageService {
  private readonly containerName = process.env.AZURE_CONTAINER_NAME || 'app-photos';
  private readonly blobServiceClient: BlobServiceClient;

  constructor() {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error('AZURE_STORAGE_CONNECTION_STRING not set');
    }
    this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    // Get container client
    const containerClient = this.blobServiceClient.getContainerClient(this.containerName);

    // Create container if it doesn't exist
    await containerClient.createIfNotExists({ access: 'container' });

    // Generate unique blob name
    const ext = path.extname(file.originalname);
    const blobName = `${uuidv4()}${ext}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload file buffer
    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });

    // Return public URL
    return blockBlobClient.url;
  }
}
