import { SQS } from "@aws-sdk/client-sqs";
import { config } from "dotenv";

config();

// Validate required environment variables
const requiredEnvVars = [
  "AWS_REGION",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_QUEUE_URL",
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

// Initialize SQS client
const sqsClient = new SQS({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * Fetches a message from the SQS queue and deletes it upon successful retrieval.
 * @returns {Promise<string | undefined>} The body of the message if available, otherwise undefined.
 */
export const sqsPopper = async (): Promise<string | undefined> => {
  const queueUrl = process.env.AWS_QUEUE_URL!;

  try {
    console.log("Polling messages from SQS queue...");

    // Receive message from the queue
    const data = await sqsClient.receiveMessage({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1, // Explicitly limiting to one message
      WaitTimeSeconds: 5, // Adds a short wait to avoid excessive polling
    });

    if (data.Messages && data.Messages.length > 0) {
      const message = data.Messages[0];
      console.log("Message received:", message.Body);

      // Attempt to delete the message from the queue
      try {
        await sqsClient.deleteMessage({
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle,
        });
        console.log("Message deleted successfully.");
      } catch (deleteError) {
        console.error("Failed to delete message from the queue:", deleteError);
        return undefined;
      }

      return message.Body || undefined;
    } else {
      console.log("No messages available in the queue.");
      return undefined;
    }
  } catch (err) {
    console.error("Error while fetching messages from SQS queue:", err);
    return undefined;
  }
};
