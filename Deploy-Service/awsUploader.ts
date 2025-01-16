import fs from "fs";
import { config } from "dotenv";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import path from "path";
// import { S3 } from "aws-sdk";

config();

// const s3 = new S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });
// export const uploadFile = async (fileName: string, localFilePath: string) => {
//   const fileContent = fs.readFileSync(localFilePath);
//   const params = {
//     Bucket: process.env.BUCKET_NAME || "",
//     Key: fileName,
//     Body: fileContent,
//   };
//   try {
//     const res = await s3.upload(params).promise();
//     console.log(`Uploaded ${fileName}`);
//     console.log(res);
//   } catch (error) {
//     console.error(`Error uploading ${fileName}`);
//     console.error(error);
//   }
// };
const getAllFiles = (directoryBasePath: string) => {
  // console.log(directoryBasePath);
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

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "accessKeyId",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "secretAccessKey",
  },
});

export const uploadFile = async (fileName: string, localFilePath: string) => {
  //fileName = output/12ae3../index.html
  //filePath = Users/username/vercel-clone/output/12ae3../index.html i.e. (__dirname + "/" + fileName)
  // console.log(localFilePath);
  getAllFiles(localFilePath).forEach(async (filePath) => {

    let fileContent;
    try {
      fileContent = fs.readFileSync(filePath);
    } catch (error) {
      console.error(`Error reading file ${filePath}`);
      console.error(error);
      return;
    }

    const params = {
      Bucket: process.env.BUCKET_NAME || "",
      Key: filePath.slice(__dirname.length + 1),
      Body: fileContent,
    };
    try {
      await s3Client.send(new PutObjectCommand(params));
      // console.log(`Uploaded ${filePath.slice(__dirname.length + 1)}`);
    } catch (error) {
      console.error(`Error uploading ${fileName}`);
      console.error(error);
    }
  });
  console.log("Upload Complete");
};
