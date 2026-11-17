import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

// Screenshots the rendered page and email with Playwright's Chromium, and
// copies the social card into docs/ for the README. Run after
// `npm run build`: it reads out/page.html, out/email.html and
// out/social-card.png.
//
// On a fresh machine, install the browser first:
// `npx playwright-core install chromium`.
// The launcher below also finds a Chromium already cached by another
// Playwright version, so screenshots work without a download where one
// is present.
//
// The footer's social icons are remote images (Unlayer's CDN, as the
// Social element serves them). A screenshot taken where the browser
// cannot reach the network would show them broken, so the script inlines
// them as data URIs into temporary copies of the HTML and screenshots
// those — the files in out/ are left exactly as the build wrote them.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "out");
const docsDir = path.join(root, "docs");

const SOCIAL_ICON_URL = /https:\/\/cdn\.tools\.unlayer\.com\/social\/icons\/[a-z]+\/[a-z0-9]+\.png/g;

/**
 * A screenshot-ready copy of an output HTML file, in the temp directory,
 * with the remote social icons inlined as data URIs. Where an icon cannot
 * be fetched, it is left remote and the screenshot shows it broken — the
 * run still completes.
 */
async function screenshotReadyHtml(file) {
  const html = await readFile(path.join(outDir, file), "utf8");
  const urls = [...new Set(html.match(SOCIAL_ICON_URL) ?? [])];
  let ready = html;
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      ready = ready.replaceAll(url, `data:image/png;base64,${bytes.toString("base64")}`);
    } catch (error) {
      console.error(`Could not inline ${url} for the screenshot (${error.message}); it will show broken.`);
    }
  }
  const tmp = path.join(os.tmpdir(), `aegean-wedding-kit-${file}`);
  await writeFile(tmp, ready);
  return tmp;
}

/** The newest full Chromium in Playwright's browser cache, if there is one. */
async function cachedChromiumPath() {
  const browsersPath = process.env.PLAYWRIGHT_BROWSERS_PATH || path.join(os.homedir(), ".cache", "ms-playwright");
  let entries;
  try {
    entries = await readdir(browsersPath, { withFileTypes: true });
  } catch {
    return undefined;
  }
  const revisions = entries
    .filter((entry) => entry.isDirectory() && /^chromium-\d+$/.test(entry.name))
    .map((entry) => Number(entry.name.slice("chromium-".length)))
    .sort((a, b) => b - a);
  for (const revision of revisions) {
    for (const subdir of ["chrome-linux64", "chrome-linux"]) {
      const candidate = path.join(browsersPath, `chromium-${revision}`, subdir, "chrome");
      try {
        await import("node:fs/promises").then((fs) => fs.access(candidate));
        return candidate;
      } catch {
        // Try the next candidate.
      }
    }
  }
  return undefined;
}

async function launchBrowser() {
  // Chromium doesn't read proxy settings from the environment the way
  // curl and Node do, so hand it the proxy explicitly where one is set —
  // otherwise the remote social icons in the screenshots come out broken.
  const proxyServer =
    process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy;
  // Playwright takes the credentials apart from the server URL: a
  // user:password@host URL passed as-is authenticates nowhere.
  let proxy;
  if (proxyServer) {
    try {
      const url = new URL(proxyServer);
      proxy = {
        server: `${url.protocol}//${url.host}`,
        username: url.username ? decodeURIComponent(url.username) : undefined,
        password: url.password ? decodeURIComponent(url.password) : undefined,
        bypass: process.env.NO_PROXY || process.env.no_proxy || undefined,
      };
    } catch {
      proxy = { server: proxyServer };
    }
  }
  const options = proxy ? { proxy } : {};
  try {
    return await chromium.launch(options);
  } catch (error) {
    console.error(`Default Chromium launch failed: ${error.message.split("\n")[0]}`);
  }
  const cached = await cachedChromiumPath();
  if (cached) {
    console.error(`Trying the cached Chromium at ${cached}`);
    try {
      return await chromium.launch({ ...options, executablePath: cached });
    } catch (error) {
      console.error(`Cached Chromium launch failed: ${error.message.split("\n")[0]}`);
    }
  }
  console.error("Falling back to /opt/meta-chromium/chrome");
  return await chromium.launch({ ...options, executablePath: "/opt/meta-chromium/chrome" });
}

const browser = await launchBrowser();
try {
  await mkdir(docsDir, { recursive: true });

  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  await page.goto(`file://${await screenshotReadyHtml("page.html")}`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(docsDir, "screenshot-page.png"), fullPage: true });
  console.log("docs/screenshot-page.png");

  const email = await browser.newPage({ viewport: { width: 700, height: 900 } });
  await email.goto(`file://${await screenshotReadyHtml("email.html")}`, { waitUntil: "networkidle" });
  await email.screenshot({ path: path.join(docsDir, "screenshot-email.png"), fullPage: true });
  console.log("docs/screenshot-email.png");
} finally {
  await browser.close();
}

await copyFile(path.join(outDir, "social-card.png"), path.join(docsDir, "social-card.png"));
console.log("docs/social-card.png");
