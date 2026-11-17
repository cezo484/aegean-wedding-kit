import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { ElementsError, formatDiagnostics, outline, render, validate } from "@hyper-elements/react";
import { renderPdf } from "@hyper-elements/react/pdf";
import { renderImage } from "@hyper-elements/react/image";
import { emailClients, renderInEmailClients } from "@hyper-elements/email-clients";
import { loadFonts } from "./fonts";
import { WeddingCanvas } from "./templates/canvas";
import { WeddingDocument } from "./templates/document";
import { WeddingEmail } from "./templates/email";
import { WeddingPage } from "./templates/page";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "out");

/** Gmail clips emails larger than 102 KB — the build fails above this. */
const EMAIL_SIZE_LIMIT = 102 * 1024;

const templates = [
  { name: "email", element: React.createElement(WeddingEmail) },
  { name: "page", element: React.createElement(WeddingPage) },
  { name: "document", element: React.createElement(WeddingDocument) },
  { name: "canvas", element: React.createElement(WeddingCanvas) },
] as const;

function fail(message: string): never {
  console.error(`\nERROR: ${message}`);
  process.exit(1);
}

async function logSize(file: string) {
  const { size } = await stat(file);
  console.log(`  ${path.relative(root, file)} — ${size.toLocaleString("en-US")} bytes`);
  return size;
}

async function main() {
  await mkdir(outDir, { recursive: true });
  await mkdir(path.join(outDir, "clients"), { recursive: true });

  // 1. Validate every template; the email also gets the email-clients
  // plugin, which checks what Outlook, Gmail, Apple Mail and the others
  // remove or change.
  console.log("Validating templates…");
  const plugin = await emailClients();
  for (const { name, element } of templates) {
    const result = validate(element, name === "email" ? { plugins: [plugin] } : undefined);
    const text = formatDiagnostics(result.diagnostics);
    if (text) console.log(`\n[${name}] diagnostics:\n${text}`);
    if (!result.valid) fail(`validate() failed for ${name} — see diagnostics above.`);
    console.log(`  ${name}: valid`);
  }

  // 2. Print each template's outline: every block, its width, its text.
  for (const { name, element } of templates) {
    console.log(`\nOutline: ${name}\n${outline(element)}`);
  }

  const fonts = await loadFonts();

  // 3. Render everything.
  console.log("\nRendering…");
  const email = await render(templates[0].element);
  await writeFile(path.join(outDir, "email.html"), email.html);
  await writeFile(path.join(outDir, "email.txt"), email.text);
  const emailSize = await logSize(path.join(outDir, "email.html"));
  await logSize(path.join(outDir, "email.txt"));
  if (emailSize > EMAIL_SIZE_LIMIT) {
    fail(
      `email.html is ${emailSize.toLocaleString("en-US")} bytes — over Gmail's 102 KB clip limit. ` +
        "Shrink the email before shipping it.",
    );
  }

  const page = await render(templates[1].element);
  await writeFile(path.join(outDir, "page.html"), page.html);
  await logSize(path.join(outDir, "page.html"));

  const documentHtml = await render(templates[2].element);
  await writeFile(path.join(outDir, "invitation-print.html"), documentHtml.html);
  await logSize(path.join(outDir, "invitation-print.html"));

  const { pdf, diagnostics: pdfDiagnostics } = await renderPdf(templates[2].element, { fonts });
  const pdfText = formatDiagnostics(pdfDiagnostics);
  if (pdfText) console.log(`\n[pdf] diagnostics:\n${pdfText}`);
  await writeFile(path.join(outDir, "invitation.pdf"), pdf);
  await logSize(path.join(outDir, "invitation.pdf"));

  const { image, width, height, diagnostics: imageDiagnostics } = await renderImage(templates[3].element, { fonts });
  const imageText = formatDiagnostics(imageDiagnostics);
  if (imageText) console.log(`\n[image] diagnostics:\n${imageText}`);
  if (width !== 1200 || height !== 630) fail(`social card is ${width}×${height}, expected 1200×630.`);
  await writeFile(path.join(outDir, "social-card.png"), image);
  await logSize(path.join(outDir, "social-card.png"));

  // 4. Email-client previews: the email as Outlook, Gmail and Apple Mail
  // draw it, one self-contained HTML file per client.
  console.log("\nRendering email-client previews…");
  const { previews, skipped, diagnostics: clientDiagnostics } = await renderInEmailClients(templates[0].element, {
    emailClients: ["outlook", "gmail", "apple-mail"],
    computers: ["windows"],
  });
  const clientText = formatDiagnostics(clientDiagnostics);
  if (clientText) console.log(`\n[email-clients] diagnostics:\n${clientText}`);
  for (const preview of previews) {
    await writeFile(path.join(outDir, "clients", preview.filename), preview.html);
    await logSize(path.join(outDir, "clients", preview.filename));
  }
  for (const skip of skipped) console.log(`  skipped: ${skip.client} (${skip.reason})`);

  console.log("\nDone. Outputs are in out/.");
}

try {
  await main();
} catch (error) {
  if (error instanceof ElementsError) {
    console.error(formatDiagnostics(error.diagnostics));
  } else {
    console.error(error);
  }
  process.exit(1);
}
