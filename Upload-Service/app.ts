import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
// import path from "path";
// import simpleGit from "simple-git";
import { generateRandomId } from "./idGenerator";
// import { getAllFiles } from "./files";
// import { uploadFile } from "./awsUploader";
import { sendToQueue } from "./sqsSender";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json()); // Express doesn't care what the body is, and we have to use the respective middleware by ourselves to parse the body
//We can use spawn but we will use simple git for cleaner code and simplicity

app.get("/", (req: Request, res: Response): void => {
  res.send("Hello World!");
});

//We tested using postman and it works fine
app.post("/deploy", async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Request received\n");

    const repoUrl: string = req.body.repoUrl; // GitHub repository URL
    const repoBase: string | undefined = req.body.repoBase; // The base folder of the repository
    if (!repoUrl) {
      res.status(400).json({ error: "repoUrl is required" });
      return;
    }
    const repoId = generateRandomId();
    // console.log("Cloning repository\n");
    // await simpleGit().clone(repoUrl, path.join(__dirname, `output/${repoId}`));
    // console.log(path.join(__dirname, `output/${repoId}`));
    //There is no easy way to upload a directory to s3, so we make an array of the location of the files and upload them one by one
    // const filesLocalPathArray = getAllFiles(
    //   path.join(__dirname, `output/${repoId}`)
    // );
    //We can use the AWS SDK to upload files to S3
    // console.log(`Uploading files to S3 for repoId: ${repoId}\n`);
    // for (const localFilePath of filesLocalPathArray) {
    //   const fileName = localFilePath.slice(__dirname.length + 1);
    //   try {
    //     await uploadFile(fileName, localFilePath);
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ error: `Failed to upload file: ${fileName}` });
    //     return;
    //   }
    // }
    let queueMessageId: string | undefined;
    try {
      queueMessageId = await sendToQueue(repoId, repoUrl, repoBase);
      if (!queueMessageId) {
        throw new Error("Failed to send to queue");
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to send to queue" });
      return;
    }
    console.log("Sent to queue\n");
    res.json({ repoId, repoUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
