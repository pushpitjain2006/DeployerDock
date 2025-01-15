import { exec } from "child_process";
import path from "path";


export async function buildProject(id: string) {
    const child = exec(`cd ${path.join(__dirname,"output",id)} && npm install && npm run build`)

}
