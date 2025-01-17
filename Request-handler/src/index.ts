import express from "express";
import dotenv from "dotenv";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

dotenv.config();
const app = express();

const S3client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "accessKeyId",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "secretAccessKey",
  },
});

app.get("/*", async (req, res) => {
  const host = req.hostname;
  const id = host.split(".")[0];
  const filePath = req.path;
  const bucketName = process.env.BUCKET_NAME || "bucketName";
  const file = await S3client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: `dist/${id}${filePath}`,
    })
  );
  const Type = filePath.endsWith("html")
    ? "text/html"
    : "application/javascript";
  res.set("Content-Type", Type);
  res.type(Type).send(file.Body);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
