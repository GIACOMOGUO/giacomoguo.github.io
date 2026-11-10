import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const port = Number(process.env.WEBSITE_V1_PREVIEW_PORT || 4173);
createServer(async (request, response) => {
  const pages = { "/": "index.html", "/index.html": "index.html", "/mobile.html": "mobile.html" };
  if (!Object.hasOwn(pages, request.url)) {
    response.writeHead(404).end();
    return;
  }
  try {
    const content = await readFile(new URL("./dist/" + pages[request.url], import.meta.url));
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
    response.end(content);
  } catch {
    response.writeHead(503).end("Run node build.mjs to generate the preview.");
  }
}).listen(port, "127.0.0.1", () => console.log(`Preview: http://127.0.0.1:${port}/`));
