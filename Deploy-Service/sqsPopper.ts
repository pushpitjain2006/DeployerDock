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

export const sqsPopper = async (): Promise<string | undefined> => {
  try {
    // console.log("Getting from Queue");
    const data = await sqsClient.receiveMessage({
      QueueUrl: process.env.AWS_QUEUE_URL || "Default Queue URL",
    });
    // console.log(data);
    if (data.Messages) {
      // console.log("Success", data.Messages);
      try {
        await sqsClient.deleteMessage({
          QueueUrl: process.env.AWS_QUEUE_URL || "Default Queue URL",
          ReceiptHandle: data.Messages[0].ReceiptHandle,
        });
      } catch (error) {
        console.log("Error in deleting message", error);
        return undefined;
      }
      return data.Messages[0].Body;
    }
    return undefined;
  } catch (err) {
    console.log("Error :\n", err);
    return undefined;
  }
};

if (require.main === module) {
  const op = async () => {
    console.log(await sqsPopper());
  };
  op();
}
