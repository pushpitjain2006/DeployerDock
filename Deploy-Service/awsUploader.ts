import fs from "fs";
import { config } from "dotenv";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
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
  console.log(fileName);
  console.log(localFilePath);
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    Body: fs.createReadStream(localFilePath),
  });
  try {
    await s3Client.send(command);
    // console.log(`Uploaded ${fileName}`);
  } catch (error) {
    console.error(`Error uploading ${fileName}`);
    console.error(error);
  }
};
