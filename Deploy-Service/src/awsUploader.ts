import fs from "fs";
import { config } from "dotenv";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import path from "path";

config();

/**
 * Recursively retrieves all file paths within a given directory.
 * @param directoryBasePath - The base directory to scan.
 * @returns An array of absolute file paths.
 */
const getAllFiles = (directoryBasePath: string): string[] => {
  const files: string[] = [];
  const filesInDirectory = fs.readdirSync(directoryBasePath);

  filesInDirectory.forEach((file) => {
    const fullPath = path.join(directoryBasePath, file);

    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  });

  return files;
};

// Configure S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Displays a dynamic progress bar in the console.
 * @param completed - The number of completed tasks.
 * @param total - The total number of tasks.
 */
const showProgressBar = (completed: number, total: number) => {
  const percentage = Math.floor((completed / total) * 100);
  const progressBarWidth = 20; // Width of the progress bar
  const completedBars = Math.floor((percentage / 100) * progressBarWidth);
  const bar = `[${"=".repeat(completedBars)}${" ".repeat(
    progressBarWidth - completedBars
  )}] ${percentage}%`;
  process.stdout.clearLine(0); // Clear the current line
  process.stdout.cursorTo(0); // Move to the start of the line
  process.stdout.write(bar); // Write the progress bar
};

/**
 * Uploads files to an S3 bucket with progress tracking.
 * @param fileName - The base S3 key (prefix) under which files will be uploaded.
 * @param localFilePath - The local directory containing files to upload.
 */
export const uploadFile = async (fileName: string, localFilePath: string) => {
  const allFiles = getAllFiles(localFilePath);

  if (!allFiles.length) {
    console.error(`No files found in the directory: ${localFilePath}`);
    return;
  }

  console.log(`Uploading ${allFiles.length} files from ${localFilePath}...`);

  let completedCount = 0; // To track completed uploads

  // Map each file to an upload promise
  const uploadPromises = allFiles.map(async (filePath) => {
    const relativePath = filePath.slice(localFilePath.length + 1); // Get the relative file path
    const s3Key = path.join(fileName, relativePath);

    try {
      const fileContent = fs.readFileSync(filePath); // Read the file content

      const params = {
        Bucket: process.env.BUCKET_NAME || "",
        Key: s3Key,
        Body: fileContent,
      };

      // Upload the file to S3
      await s3Client.send(new PutObjectCommand(params));
    } catch (error) {
      console.error(`Error uploading file: ${filePath}`);
      console.error(error);
    } finally {
      completedCount++;
      showProgressBar(completedCount, allFiles.length); // Update the progress bar
    }
  });

  // Wait for all uploads to complete
  await Promise.all(uploadPromises);

  console.log("\nAll files uploaded successfully.");
};
