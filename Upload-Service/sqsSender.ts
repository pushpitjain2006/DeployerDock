import {
  SendMessageCommand,
  SendMessageCommandOutput,
  SQS,
} from "@aws-sdk/client-sqs";
import { config } from "dotenv";

config();

const sqsClient = new SQS({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "accessKeyId",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "secretAccessKey",
  },
});

/**
 * Sends a message to an SQS queue.
 * @param repoId - The repository ID to be sent.
 * @param repoBase - The base folder of the repository.
 * @returns The SQS message ID or an error.
 */

export const sendToQueue = async (
  repoId: string,
  repoBase?: string
): Promise<string | undefined> => {
  const queueUrl = process.env.AWS_QUEUE_URL;

  if (!queueUrl) {
    console.error("AWS_QUEUE_URL is not defined in the environment variables.");
    throw new Error("Queue URL is required.");
  }

  try {
    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify({ repoId, repoBase }),
    });
    const response: SendMessageCommandOutput = await sqsClient.send(command);
    // console.log("Success", data.MessageId);
    if (response.MessageId) {
      console.log(
        `Message sent to SQS successfully. MessageId: ${response.MessageId}`
      );
      return response.MessageId;
    } else {
      console.error("Message was sent but no MessageId was returned.");
      return undefined;
    }
  } catch (error) {
    console.error("Failed to send message to SQS", error);
    throw new Error("Failed to send message to SQS");
  }
};
