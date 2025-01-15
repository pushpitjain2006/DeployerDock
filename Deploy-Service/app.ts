import dotenv from "dotenv";
import { sqsPopper } from "./sqsPopper";
import { deployer } from "./deploymentBase";

dotenv.config();

const hero1 = async () => {
  let waitingTime = 5;
  while (true) {
    const x = await sqsPopper();
    if (x) {
      console.log(x);
      waitingTime = 5;
      await deployer(x);
    } else {
      console.log("No More Message, waiting for ", waitingTime, " seconds\n");
      await new Promise((resolve) => setTimeout(resolve, waitingTime * 1000));
      if (waitingTime < 10) {
        waitingTime += 1;
      }
    }
  }
};

hero1();
