import * as fs from "fs";
import * as path from "path";

export const localSpaceReleaser = (folderPath: string) => {
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
};
