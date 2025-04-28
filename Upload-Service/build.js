import { build } from "esbuild";

build({
  entryPoints: ["./app.ts"],
  bundle: true,
  outfile: "./dist/app.cjs",
  platform: "node",
  target: "es2020",
  sourcemap: true,
  tsconfig: "./tsconfig.json",
}).catch(() => process.exit(1));
