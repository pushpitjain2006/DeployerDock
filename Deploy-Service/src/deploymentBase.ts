import { config } from "dotenv";
import path from "path";
import { buildProject } from "./buildingRepo";
import { uploadFile } from "./awsUploader";
import simpleGit from "simple-git";
import { localSpaceReleaser } from "./spaceReleaser";

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
    console.log(`Starting deployment for repoId: ${repoId}`);

    // Clone the repository
    console.log(`Cloning repository: ${repoUrl}`);
    await simpleGit().clone(repoUrl, outputDir);
    console.log("Repository cloned successfully.");

    // Build the project
    console.log("Building the project...");
    await buildProject(repoId, repoBase);
    console.log("Project built successfully.");

    // Upload build artifacts to S3
    console.log("Uploading build artifacts to S3...");
    await uploadFile(s3DistPath, distDir);
    console.log("Build artifacts uploaded successfully.");

    // Release local space after successful deployment
    console.log("Releasing local space...");
    localSpaceReleaser(path.join(__dirname, "output"));
    console.log("Local space released successfully.");

    console.log(`Deployment for repoId: ${repoId} completed.`);
  } catch (error) {
    console.error(`Error during deployment for repoId: ${repoId}`, error);

    // Ensure that local space is released even if there's an error
    console.log("Releasing local space due to error...");
    localSpaceReleaser(path.join(__dirname, "output"));
    throw error; // Re-throw the error to allow upstream handling
  }
};
