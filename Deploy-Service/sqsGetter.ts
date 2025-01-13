import { SQS } from "@aws-sdk/client-sqs";
import { config } from "dotenv";

config();

const sqsClient = new SQS({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "accessKeyId",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "secretAccessKey",
  },
});

export const getFromQueue = async () => {
  try {
    const data = await sqsClient.receiveMessage({
      QueueUrl: process.env.AWS_QUEUE_URL || "Default Queue URL",
    });
    console.log("Success", data.Messages);
    return data.Messages;
  } catch (err) {
    console.log("Error", err);
    return err;
  }
};
