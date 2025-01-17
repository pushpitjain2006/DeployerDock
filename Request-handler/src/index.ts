import express from "express";
import { SQS } from '@aws-sdk/client-sqs';

const app = express();

const sqsClient = new SQS({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "accessKeyId",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "secretAccessKey",
  },
});

app.get("/*", (req, res) => {
  const host = req.hostname;
  const id = host.split(".")[0];
  const filePath = req.path;
  
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
