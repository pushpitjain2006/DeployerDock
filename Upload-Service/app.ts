import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import simpleGit from "simple-git";
import { generateRandomId } from "./utils";
import { getAllFiles } from "./files";
import { uploadFile } from "./awsUploader";
import { sendToQueue } from "./sqsSender";

const app = express();
app.use(cors());
dotenv.config();

app.use(express.json()); // Express doesn't care what the body is, and we have to use the respective middleware by ourselves to parse the body

//We can use spawn but we will use simple git for cleaner code and simplicity

//We tested using postman and it works fine
app.post("/deploy", async (req, res) => {
  console.log("Request received\n");
  const repoUrl = req.body.repoUrl; // GitHub repository URL
  const repoBase = req.body.repoBase; // The base folder of the repository
  if (!repoUrl) {
    res.status(400).json({ error: "repoUrl is required" });
    return;
  }
  const repoId = generateRandomId();
  await simpleGit().clone(repoUrl, path.join(__dirname, `output/${repoId}`));
  // console.log(path.join(__dirname, `output/${repoId}`));
  //There is no easy way to upload a directory to s3, so we make an array of the location of the files and upload them one by one
  const filesLocalPathArray = getAllFiles(
    path.join(__dirname, `output/${repoId}`)
  );
  //We can use the AWS SDK to upload files to S3
  for (let i = 0; i < filesLocalPathArray.length; i++) {
    const localFilePath = filesLocalPathArray[i];
    const fileName = localFilePath.slice(__dirname.length + 1);
    try {
      await uploadFile(fileName, localFilePath);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to upload file" });
      return;
    }
  }
  let queueMessageId;
  try {
    // console.log("Sending to queue\n");
    queueMessageId = await sendToQueue(repoId, repoBase);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to send to queue" });
    return;
  }
  console.log("Send to queue\n");
  console.log("Server is running on port 3000");
  res.json({ repoId, queueMessageId });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
