import esbuild from 'esbuild';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

const args = process.argv.slice(2);
const watch = args.includes('--watch');

const config = {
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'dist/extension.js',
  platform: 'node',
  target: 'node20',
  external: ['vscode'],
  format: 'cjs',
  sourcemap: true,
  minify: false,
  plugins: [],
  define: {
    'process.env.EXTENSION_VERSION': `"${pkg.version}"`
  },
  keepNames: true
};

if (watch) {
  const ctx = await esbuild.context(config);
  await ctx.watch();
  console.log('Watching for changes...');
} else {
  await esbuild.build(config);
  console.log('Build completed successfully.');
}