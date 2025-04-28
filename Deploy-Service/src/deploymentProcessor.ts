import { deployer } from "./deploymentBase";
import { safelyParseJSON, delay } from "./utils/helpers";
import { logger } from "./utils/logger";
import { DeploymentData } from "../types/deployment";

const MAX_RETRIES = 3;

const isValidDeploymentData = (data: any | null): data is DeploymentData => {
  return !!(data && data.repoId && data.repoUrl);
};

export const processMessage = async (message: string): Promise<void> => {
  const data = safelyParseJSON(message);

  if (!isValidDeploymentData(data)) {
    logger.warn("Invalid data received. Skipping...");
    return;
  }

  logger.info({ repoId: data.repoId }, "Processing deployment");
  await deployer(data.repoId, data.repoUrl, data.repoBase);
};

export const processPollingJobs = async (sqsPopper: () => Promise<string | null>, stopFlag: { stopped: boolean }) => {
  logger.info("Starting deployment service in polling mode...");

  while (!stopFlag.stopped) {
    try {
      const message = await sqsPopper();

      if (message) {
        let attempt = 0;
        while (attempt < MAX_RETRIES) {
          try {
            await processMessage(message);
            break; // success, exit retry loop
          } catch (error) {
            attempt++;
            logger.error({ attempt, error }, "Error processing message, retrying...");
            if (attempt >= MAX_RETRIES) {
              logger.error("Max retries reached. Skipping message...");
            }
          }
        }
      } else {
        logger.info("No messages in queue. Waiting for 5 seconds...");
        await delay(5000);
      }
    } catch (error) {
      logger.error({ error }, "Unhandled error during polling");
    }
  }

  logger.info("Polling service stopped gracefully.");
};

export const handler = async (event: any): Promise<void> => {
  logger.info("Starting deployment service in serverless mode...");

  const records = event?.Records || [];

  for (const record of records) {
    try {
      await processMessage(record.body);
    } catch (error) {
      logger.error({ error }, "Error processing serverless event");
    }
  }
};