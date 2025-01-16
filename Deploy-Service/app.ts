import dotenv from "dotenv";
import { sqsPopper } from "./sqsPopper";
import { deployer } from "./deploymentBase";

dotenv.config();

const hero1 = async () => {
  while (true) {
    const x = await sqsPopper();
    if (x) {
      const data = JSON.parse(x);
      await deployer(data["repoId"], data["repoBase"]);
    } else {
      console.log("Empty, waiting for  5 seconds\n");
      await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
    }
  }
};

hero1();
