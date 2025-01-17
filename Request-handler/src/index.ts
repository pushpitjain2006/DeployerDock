import express from "express";
import dotenv from "dotenv";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import path from "path";

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

const streamToString = (stream: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on("data", (chunk: any) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
app.get("/*", async (req, res) => {
  const host = req.hostname;
  const id = host.split(".")[0];
  const UndecodedFilePath = req.path;
  let filePath = decodeURIComponent(UndecodedFilePath);
  if (filePath === "/") {
    filePath = "/index.html";
  }

  console.log("Request received for: " + filePath);
  const bucketName = process.env.BUCKET_NAME || "bucketName";
  try {
    const file = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: path.join("dist", id, filePath),
      })
    );
    const type = filePath.endsWith("html")
      ? "text/html"
      : filePath.endsWith("css")
      ? "text/css"
      : "application/javascript";
    res.set("Content-Type", type);
    const fileBody = await streamToString(file.Body);
    res.send(fileBody);
  } catch (error) {
    console.error("Error fetching file from S3:", error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
