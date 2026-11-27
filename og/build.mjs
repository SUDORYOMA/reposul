// og/og.html を 1200×630 で撮って og-image.png にする（Chrome の画面なし起動）
// 使い方：node og/build.mjs（サイト）／node og/build.mjs demo（アプリの公開デモ。reposul-next に書く）
import { launch, sleep } from "../../reposul-next/docs/flow/cdp.mjs";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const demo = process.argv[2] === "demo";
const src = demo ? "demo.html" : "og.html";
const out = demo ? path.join(here, "..", "..", "reposul-next", "src", "app", "demo", "opengraph-image.png") : path.join(here, "..", "og-image.png");
const p = await launch({ port: 9371, width: 1200, height: 630 });
await p.size(1200, 630, false, 1);
await p.send("Page.navigate", { url: pathToFileURL(path.join(here, src)).href });
for (let i = 0; i < 40; i++) {
  await sleep(250);
  if (await p.eval(`document.readyState === "complete"`).catch(() => false)) break;
}
await p.eval(`document.fonts.ready.then(() => true)`);
await sleep(800);
const shot = await p.send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 } });
writeFileSync(out, Buffer.from(shot.data, "base64"));
p.close();
console.log(`${out} を書きました`);
