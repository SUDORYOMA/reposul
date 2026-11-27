// アプリのログイン画面をスマホの大きさで撮る（og/login.html のスマホの中身）。node og/shot-login.mjs
import { launch, sleep } from "../../reposul-next/docs/flow/cdp.mjs";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const p = await launch({ port: 9372, width: 375, height: 812 });
await p.size(375, 812, true, 3);
await p.goto("https://app.reposul.com/login", 2500);
const shot = await p.send("Page.captureScreenshot", { format: "png" });
writeFileSync(path.join(here, "login-phone.png"), Buffer.from(shot.data, "base64"));
p.close();
console.log("login-phone.png");
