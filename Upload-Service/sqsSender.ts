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

export const sendToQueue = async (repoId: string, repoBase: string) => {
  try {
    const data = await sqsClient.sendMessage({
      QueueUrl: process.env.AWS_QUEUE_URL || "Default Queue URL",
      MessageBody: JSON.stringify({ repoId, repoBase }),
    });
    // console.log("Success", data.MessageId);
    return data.MessageId;
  } catch (err) {
    console.log("Error", err);
    return err;
  }
};
