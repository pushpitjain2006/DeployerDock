import { config } from "dotenv";
import path from "path";
import { buildProject } from "./buildingRepo";
import { uploadFile } from "./awsUploader";
import simpleGit from "simple-git";
import { localSpaceReleaser } from "./spaceReleaser";
import { logger } from "./utils/logger";

config();

/**
 * Deploys a repository by cloning it, building it, and uploading the build artifacts to S3.
 * @param repoId - Unique identifier for the repository.
 * @param repoUrl - URL of the Git repository.
 * @param repoBase - (Optional) Base directory of the project in the repository.
 */
export const deployer = async (
  repoId: string,
  repoUrl: string,
  repoBase?: string
): Promise<void> => {
  const outputDir = path.join(__dirname, `output/${repoId}`);
  const distDir = path.join(
    __dirname,
    "output",
    repoId,
    repoBase || "",
    "dist"
  );
  const s3DistPath = path.join("dist", repoId);

  try {
    logger.info({ repoId, repoUrl }, `Starting deployment for repoId: ${repoId}`);

    logger.info({ repoId, repoUrl }, `Cloning repository: ${repoUrl}`);
    await simpleGit().clone(repoUrl, outputDir);
    logger.info("Repository cloned successfully.");

    logger.info("Building the project...");
    await buildProject(repoId, repoBase);
    logger.info("Project built successfully.");

    logger.info("Uploading build artifacts to S3...");
    await uploadFile(s3DistPath, distDir);
    logger.info("Build artifacts uploaded successfully.");

    logger.info("Releasing local space...");
    localSpaceReleaser(path.join(__dirname, "output"));
    logger.info("Local space released successfully.");

    logger.info(`Deployment for repoId: ${repoId} completed.`);
  } catch (error) {
    logger.error({ error, repoId, repoUrl }, `Error during deployment for repoId: ${repoId}`);

    logger.info("Releasing local space due to error...");
    localSpaceReleaser(path.join(__dirname, "output"));
    throw error;
  }
};