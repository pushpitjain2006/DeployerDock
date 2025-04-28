import { Request, Response } from "express";
import { generateRandomId } from "../utils/idGenerator";
import { sendToQueue } from "../services/sqsSender";

const deployController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { repoUrl, repoBase } = req.body;

    if (!repoUrl) {
      res.status(400).json({ error: "Repository URL (repoUrl) is required" });
      return;
    }

    const repoId = generateRandomId();

    try {
      const queueMessageId = await sendToQueue(repoId, repoUrl, repoBase);

      if (!queueMessageId) {
        throw new Error("Queue send failure");
      }

      res.status(200).json({ repoId, repoUrl });
    } catch (queueError) {
      console.error(queueError);
      res.status(500).json({ error: "Failed to enqueue deployment request" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default deployController;