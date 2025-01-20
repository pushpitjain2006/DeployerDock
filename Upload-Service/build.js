import { build } from 'esbuild';

build({
    entryPoints: ['./app.ts'], // Path to your entry TypeScript file
    bundle: true,                   // Bundle dependencies into the output
    outfile: './dist/app.cjs',    // Output file path
    platform: 'node',               // Target platform ('node' or 'browser')
    target: 'es2020',               // JavaScript target
    sourcemap: true,                // Generate source maps
    tsconfig: './tsconfig.json',    // Path to your tsconfig.json file
}).catch(() => process.exit(1));