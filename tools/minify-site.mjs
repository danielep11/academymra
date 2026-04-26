import { promises as fs } from "node:fs";
import path from "node:path";
import { minify as minifyHtml } from "html-minifier-terser";
import CleanCSS from "clean-css";
import { minify as minifyJs } from "terser";

const root = process.cwd();
const dist = path.join(root, "dist");
const skipDirs = new Set([".git", "node_modules", "dist"]);

async function copyDir(src, dst) {
  await fs.mkdir(dst, { recursive: true });
  for (const entry of await fs.readdir(src, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dst, entry.name);
    if (entry.isDirectory()) await copyDir(from, to);
    else await fs.copyFile(from, to);
  }
}

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(p));
    else out.push(p);
  }
  return out;
}

await fs.rm(dist, { recursive: true, force: true });
await copyDir(root, dist);

for (const file of await walk(dist)) {
  if (file.includes(`${path.sep}.github${path.sep}`) || file.includes(`${path.sep}tools${path.sep}`)) continue;
  const ext = path.extname(file).toLowerCase();
  const raw = await fs.readFile(file, "utf8").catch(() => null);
  if (raw == null) continue;

  if (ext === ".html") {
    const out = await minifyHtml(raw, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      minifyCSS: true,
      minifyJS: true,
      keepClosingSlash: true
    });
    await fs.writeFile(file, out);
  }

  if (ext === ".css") {
    const out = new CleanCSS({ level: 2 }).minify(raw);
    if (!out.errors.length) await fs.writeFile(file, out.styles);
  }

  if (ext === ".js" || ext === ".mjs") {
    const out = await minifyJs(raw, { compress: true, mangle: true });
    if (out.code) await fs.writeFile(file, out.code);
  }
}

console.log("Minified site written to dist/");
