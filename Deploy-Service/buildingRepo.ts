import { exec } from "child_process";
import path from "path";

export async function buildProject(id: string) {
  const child = exec(
    `cd ${path.join(__dirname, "output", id)} && npm install && npm run build`
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
        reject();
      }
    });
  });
}

if (require.main === module) {
  buildProject("OclEiqAu0P")
    .then(() => {
      console.log("Build Success");
    })
    .catch(() => {
      console.log("Build Failed");
    });
}
