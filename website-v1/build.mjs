import { mkdir, readFile, writeFile } from "node:fs/promises";
import { runInNewContext, Script } from "node:vm";
import { strict as assert } from "node:assert";

const source = new URL("./", import.meta.url);
const read = name => readFile(new URL(name, source), "utf8");
const [html, css, data, js] = await Promise.all(["index.html", "styles.css", "projects.js", "app.js"].map(read));
const model = { window: {} };
runInNewContext(data, model, { filename: "projects.js" });
new Script(js, { filename: "app.js" });
const { featured, projects } = model.window.portfolio;
const ids = new Set();
const assets = new Set(["assets/mark.svg"]);
for (const project of projects) {
  assert.match(project.id, /^[a-z0-9-]+$/, "Use a URL-safe project ID");
  assert(!ids.has(project.id), `Duplicate project ID: ${project.id}`);
  ids.add(project.id);
  assert(["landscape", "portrait", "square"].includes(project.ratio), `Unknown aspect ratio: ${project.ratio}`);
  for (const key of ["title", "year", "category", "type", "summary", "description"]) {
    assert(project[key]?.trim(), `Missing ${key} on ${project.id}`);
  }
  for (const image of [project.images.object, project.images.context, ...(project.hero ? [project.hero] : [])]) {
    assert(image.alt?.trim(), `Missing image alt text on ${project.id}`);
    assert.match(image.src, /^assets\/[a-zA-Z0-9][a-zA-Z0-9._/-]+\.(svg|avif|webp|png|jpe?g)$/);
    assert(!image.src.split("/").includes(".."), "Images must be inside assets/");
    assets.add(image.src);
  }
}
assert(ids.has(featured), "Featured project must exist");

const mime = { svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", avif: "image/avif" };
const embedded = new Map(await Promise.all([...assets].map(async name => {
  const buffer = await readFile(new URL(name, source));
  assert(buffer.length, `Empty image file: ${name}`);
  return [name, `data:${mime[name.split(".").pop()]};base64,${buffer.toString("base64")}`];
})));
const embed = value => value.replace(/assets\/[\w./-]+\.(svg|avif|webp|png|jpe?g)/g, name => embedded.get(name) ?? name);
const scriptTag = value => `<script>${value.replace(/<\/script/gi, "<\\/script")}</script>`;
const output = embed(html)
  .replace('<link rel="stylesheet" href="styles.css">', () => `<style>\n${css}\n</style>`)
  .replace(/  <script defer src="(?:projects|app)\.js"><\/script>\r?\n/g, "")
  .replace("</body>", () => `${scriptTag(embed(data))}\n${scriptTag(js)}\n</body>`);

await mkdir(new URL("dist/", source), { recursive: true });
await writeFile(new URL("dist/index.html", source), output);
await writeFile(new URL("dist/mobile.html", source), `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Giacomo Guo — 390px phone preview</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; padding: 16px 8px; color: #efede7; background: #171714; font: 13px system-ui, sans-serif; }
  header { display: flex; justify-content: space-between; width: min(390px, 100%); margin: 0 auto 12px; }
  a { color: inherit; }
  iframe { display: block; width: min(390px, 100%); height: calc(100dvh - 64px); margin: auto; border: 0; background: #efede7; }
</style>
<header><span>Phone preview / 390 px</span><a href="./index.html">Full-width preview</a></header>
<iframe src="./index.html" title="Interactive portfolio at phone width"></iframe>
</html>`);
console.log(`Validated ${projects.length} projects and ${assets.size} images. Built desktop and phone previews in dist/.`);
