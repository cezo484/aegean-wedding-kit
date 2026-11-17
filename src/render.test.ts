import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { render, validate } from "@hyper-elements/react";
import { renderPdf } from "@hyper-elements/react/pdf";
import { renderImage } from "@hyper-elements/react/image";
import { loadFonts } from "./fonts";
import { WeddingCanvas } from "./templates/canvas";
import { WeddingDocument } from "./templates/document";
import { WeddingEmail } from "./templates/email";
import { WeddingPage } from "./templates/page";

// Render once for the whole file: the four templates, their HTML, the PDF
// and the social card.
const emailElement = React.createElement(WeddingEmail);
const pageElement = React.createElement(WeddingPage);
const documentElement = React.createElement(WeddingDocument);
const canvasElement = React.createElement(WeddingCanvas);

const fonts = await loadFonts();
const email = await render(emailElement);
const page = await render(pageElement);
const documentHtml = await render(documentElement);
const { pdf } = await renderPdf(documentElement, { fonts });
const card = await renderImage(canvasElement, { fonts });

test("validate() is valid for all four templates", () => {
  for (const [name, element] of [
    ["email", emailElement],
    ["page", pageElement],
    ["document", documentElement],
    ["canvas", canvasElement],
  ] as const) {
    const result = validate(element);
    assert.equal(result.valid, true, `${name} should validate: ${JSON.stringify(result.diagnostics)}`);
  }
});

test("the email renders under Gmail's 102 KB clip limit", () => {
  const bytes = Buffer.byteLength(email.html, "utf8");
  assert.ok(bytes < 102 * 1024, `email.html is ${bytes} bytes, over the 102 KB limit`);
});

test("the email carries the couple, the date and the RSVP link", () => {
  assert.match(email.html, /Elena &amp; Deniz|Elena & Deniz/);
  assert.match(email.html, /18 September 2027/);
  assert.match(email.html, /https:\/\/example\.com\/rsvp/);
  assert.match(email.text, /18 September 2027/);
});

test("the page renders with the schedule and the venue", () => {
  assert.match(page.html, /Ceremony/);
  assert.match(page.html, /The Olive House/);
  assert.match(page.html, /Getting there/);
});

test("the document renders as print HTML and as a PDF", () => {
  assert.match(documentHtml.html, /Elena Marchetti/);
  assert.equal(Buffer.from(pdf.subarray(0, 5)).toString("ascii"), "%PDF-");
  assert.ok(pdf.length > 1000, "the PDF should not be empty");
});

test("the social card is 1200 × 630", () => {
  assert.equal(card.width, 1200);
  assert.equal(card.height, 630);
  // PNG signature.
  assert.deepEqual(Array.from(card.image.subarray(0, 8)), [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
});
