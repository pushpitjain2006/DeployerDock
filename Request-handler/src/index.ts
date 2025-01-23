import express, { Request, Response } from "express";
import dotenv from "dotenv";
import {
  GetObjectCommand,
  S3Client,
  GetObjectCommandOutput,
} from "@aws-sdk/client-s3";
import path from "path";
import mime from "mime-types";
import { Readable } from "stream";

dotenv.config();
const app = express();
app.use(express.json());

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "accessKeyId",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "secretAccessKey",
  },
});

app.get("/*", async (req: Request, res: Response) => {
  const host = req.hostname;
  const id = host.includes(".") ? host.split(".")[0] : "default";
  const undecodedFilePath = req.path;
  let filePath = decodeURIComponent(undecodedFilePath);
  if (filePath === "/") filePath = "/index.html";

  console.log("Request received for: " + filePath);
  const bucketName = process.env.BUCKET_NAME || "bucketName";
  try {
    const file: GetObjectCommandOutput = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: path.join("dist", id, filePath),
      })
    );

    const type = mime.lookup(filePath) || "application/octet-stream";
    res.set("Content-Type", type);

    if (file.Body instanceof Readable) {
      file.Body.pipe(res);
    } else {
      console.error("File body is empty for: ", filePath);
      res.status(404).send("File not found");
    }
  } catch (error) {
    console.error("Error fetching file from S3: ", filePath);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
