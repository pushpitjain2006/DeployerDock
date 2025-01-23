import { exec } from "child_process";
import path from "path";

// Problem is that maybe the project is not in the root folder , there could be a repo like repo/frontend and repo/backend, for no as we are trying to send the npm so i am assuming it is only for backend for now so we need to build this in the backend folder
// solution for now is try using the base as output/id/backend/ for running the npm build in the test repo
// for future we will have a base variable inputted by the user which will determine where we want to run teh commands
// in future for security reasons we will have to containerize the commands - docker and k8 type thing

export async function buildProject(id: string, repoBase?: string) {
  const child = exec(
    `cd ${path.join(
      __dirname,
      "output",
      id,
      repoBase || ""
    )} && npm install && npm run build`
  );
  child.stdout?.on("data", (data) => {
    console.log("stdout :", data);
  });
  child.stderr?.on("data", (data) => {
    console.error("stderr :", data);
  });
  return new Promise((resolve, reject) => {
    child.on("exit", (code) => {
      if (code === 0) {
        resolve("");
      } else {
        reject(new Error(`Build failed with exit code ${code}`));
      }
    });
  });
}
