import { build } from 'esbuild';

build({
    entryPoints: ['./src/index.ts'], // Path to your entry TypeScript file
    bundle: true,                   // Bundle dependencies into the output
    outfile: './dist/index.cjs',    // Output file path
    platform: 'node',               // Target platform ('node' or 'browser')
    target: 'es2020',               // JavaScript target
    sourcemap: true,                // Generate source maps
    tsconfig: './tsconfig.json',    // Path to your tsconfig.json file
}).catch(() => process.exit(1));