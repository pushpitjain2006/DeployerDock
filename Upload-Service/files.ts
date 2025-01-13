// Here we wil have the code to generate the array in which location of all the files of the directory will be stored

import fs from "fs";
import path from "path";

export const getAllFiles = (directoryBasePath: string) => {
  const response: string[] = [];
  const filesInDirectory = fs.readdirSync(directoryBasePath);
  filesInDirectory.forEach((file) => {
    const fullFilePath = path.join(directoryBasePath, file);
    if (fs.statSync(fullFilePath).isDirectory()) {
      response.push(...getAllFiles(fullFilePath));
    } else {
      response.push(fullFilePath);
    }
  });
  return response;
};
