import dotenv from "dotenv";
import { sqsPopper } from "./queueMessageService";
import { deployer } from "./deploymentBase";

dotenv.config();

/**
 * Processes deployment jobs by continuously polling SQS messages.
 * Ensures all required data is present before triggering deployment.
 */
const processDeploymentJobs = async () => {
  console.log("Starting deployment service...");

  while (true) {
    try {
      const message = await sqsPopper();

      if (message) {
        const data = safelyParseJSON(message);

        if (!isValidDeploymentData(data)) {
          console.warn("Invalid data received. Skipping...");
          continue;
        }

        console.log(`Processing deployment for repo: ${data.repoId}`);
        await deployer(data.repoId, data.repoUrl, data.repoBase);
      } else {
        console.log("No messages in queue. Waiting for 5 seconds...");
        await delay(5000);
      }
    } catch (error) {
      console.error("An error occurred during processing:", error);
    }
  }
};

/**
 * Parses a JSON string and returns the object, or null if parsing fails.
 * @param {string} jsonString - The JSON string to parse.
 * @returns {object | null} Parsed object or null if invalid.
 */
const safelyParseJSON = (jsonString: string): any | null => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null;
  }
};

/**
 * Validates that the required deployment data is present.
 * @param {object | null} data - The parsed data object to validate.
 * @returns {boolean} True if data is valid; false otherwise.
 */
const isValidDeploymentData = (data: any | null): boolean => {
  if (!data) return false;

  const { repoId, repoUrl } = data;
  return Boolean(repoId && repoUrl);
};

/**
 * Delays execution for a given number of milliseconds.
 * @param {number} ms - The delay duration in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Start processing jobs
processDeploymentJobs();
