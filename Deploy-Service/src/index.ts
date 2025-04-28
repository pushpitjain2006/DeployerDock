import dotenv from "dotenv";
import { validateEnv } from "./utils/envValidator";
import { processPollingJobs, handler } from "./deploymentProcessor";
import { sqsPopper } from "./queueMessageService";
import { logger } from "./utils/logger";

dotenv.config();
validateEnv();

const RUNTIME_MODE = process.env.RUNTIME_MODE || "polling";

const stopFlag = { stopped: false };

const gracefulShutdown = () => {
  logger.info("Graceful shutdown initiated...");
  stopFlag.stopped = true;
  setTimeout(() => process.exit(0), 5000);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

if (RUNTIME_MODE === "polling") {
  processPollingJobs(sqsPopper, stopFlag);
}

// Export handler for AWS Lambda
export default handler;