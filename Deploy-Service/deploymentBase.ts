import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { buildProject } from "./buildingRepo";
import { uploadFile } from "./awsUploader";

config();

export const downloadS3repo = async (
  S3Client: S3Client, // The S3Client from @aws-sdk (v3)
  bucketName: string, // The S3 Bucket Name
  key: string // The starting point of folder in the bucket
) => {
  const objects = await S3Client.send(
    new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: key,
    })
  );

  // for (const object of objects.Contents || []) {
  //   if (!object.Key) continue;
  //   const file = await S3Client.send(
  //     new GetObjectCommand({
  //       Bucket: bucketName,
  //       Key: object.Key,
  //     })
  //   );
  //   const filePath = path.join(__dirname, ...object.Key.split("/"));
  //   if (!fs.existsSync(path.dirname(filePath))) {
  //     fs.mkdirSync(path.dirname(filePath), { recursive: true });
  //   }
  //   const stream = file.Body as NodeJS.ReadableStream;
  //   const writeStream = fs.createWriteStream(filePath);
  //   stream.pipe(writeStream);
  //   await new Promise((resolve) => {
  //     writeStream.on("finish", resolve);
  //   });
  // }

  // if (objects.Contents && objects.Contents.length > 0) {
  //   console.log(objects.Contents[0] + "\n");
  // } else {
  //   console.log("No contents found in the bucket.");
  // }
  // objects is something like - { Contents: [ { Key: 'output/OclEiqAu0P' } ] }
  // console.log(objects.Contents);
  if (objects.Contents) {
    for (let i = 0; i < objects.Contents.length; i++) {
      const object = objects.Contents[i];
      // console.log(object);
      if (!object.Key) continue;
      // console.log(object.Key);
      const file = await S3Client.send(
        new GetObjectCommand({
          Bucket: bucketName,
          Key: object.Key,
        })
      );
      const stream = file.Body as Readable;
      // console.log(stream);
      //console.log(path.join(__dirname , "output"));
      const filePath = path.join(__dirname, object.Key);
      // console.log(object.Key);
      // console.log(filePath);
      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }
      const writeStream = fs.createWriteStream(filePath);
      stream.pipe(writeStream);
      await new Promise((resolve) => {
        writeStream.on("finish", resolve);
      });
      // console.log("File downloaded successfully");
    }
  } else {
    console.log("No objects in the bucket or the key is incorrect");
  }
};

export const deployer = async (repoId: string) => {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION || "ap-south-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "accessKeyId",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "secretAccessKey",
    },
  });
  const bucketName = process.env.BUCKET_NAME || "Default Bucket Name";
  const key = "output/" + repoId;
  // await downloadS3repo(s3Client, bucketName, key);
  // await buildProject(repoId);
  await uploadFile(
    path.join("output", repoId, "dist"),
    path.join(__dirname, "output", repoId, "venttup", "frontend", "dist")
  );
};

if (require.main === module) {
  const op = async () => {
    console.log(await deployer("OclEiqAu0P"));
  };
  op();
}
