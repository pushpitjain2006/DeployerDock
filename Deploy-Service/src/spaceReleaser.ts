import * as fs from "fs";
import * as path from "path";

/**
 * Recursively deletes files and folders in the specified directory.
 * @param folderPath - The folder to delete.
 * @throws Will throw an error if the folder does not exist or if there is an issue deleting files.
 * @description This function will delete all files and subdirectories in the specified folder.
 */
export const localSpaceReleaser = (folderPath: string) => {
  try {
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath);

      for (const file of files) {
        const currentPath = path.join(folderPath, file);

        if (fs.lstatSync(currentPath).isDirectory()) {
          localSpaceReleaser(currentPath);
        } else {
          fs.unlinkSync(currentPath);
        }
      }
      fs.rmdirSync(folderPath);
    } else {
      console.error(`Folder not found: ${folderPath}`);
    }
  } catch (error) {
    console.error(`Error while releasing space for folder: ${folderPath}`);
    console.error(error);
  }
};
