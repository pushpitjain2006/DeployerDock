import { exec } from "child_process";
import path from "path";

/**
 * @description Builds a project by running `npm install` and `npm run build` in the specified repository base.
 * @param id - The unique identifier for the repository.
 * @param repoBase - (Optional) The base directory within the repository where the build commands should run.
 * @returns A Promise that resolves if the build succeeds and rejects if it fails.
 */

export async function buildProject(
  id: string,
  repoBase?: string
): Promise<void> {
  const buildPath = path.join(__dirname, "output", id, repoBase || "");

  console.log(`Starting build process in: ${buildPath}`);

  const child = exec(`cd ${buildPath} && npm install && npm run build`);

  child.stdout?.on("data", (data) => {
    console.log(`[Build Output]: ${data}`);
  });
  child.stderr?.on("data", (data) => {
    console.error(`[Build Error]: ${data}`);
  });

  return new Promise((resolve, reject) => {
    child.on("exit", (code) => {
      if (code === 0) {
        console.log("Build completed successfully.");
        resolve();
      } else {
        console.error(`Build failed with exit code ${code}.`);
        reject(new Error(`Build failed with exit code ${code}.`));
      }
    });
  });
}
