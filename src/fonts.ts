import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface FontFile {
  family: string;
  src: Buffer;
  weight?: number;
  style?: "normal" | "italic";
}

const fontsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "assets", "fonts");

/**
 * The Noto Serif and Noto Sans files in assets/fonts/, as bytes for
 * renderPdf() and renderImage(). Nothing is fetched: the PDF and the PNG
 * are drawn entirely from these files. See assets/fonts/NOTICE.md.
 */
export async function loadFonts(): Promise<FontFile[]> {
  const files: Array<[string, string, number, "normal" | "italic"]> = [
    ["Noto Serif", "NotoSerif-Regular.ttf", 400, "normal"],
    ["Noto Serif", "NotoSerif-Bold.ttf", 700, "normal"],
    ["Noto Serif", "NotoSerif-Italic.ttf", 400, "italic"],
    ["Noto Serif", "NotoSerif-BoldItalic.ttf", 700, "italic"],
    ["Noto Sans", "NotoSans-Regular.ttf", 400, "normal"],
    ["Noto Sans", "NotoSans-Bold.ttf", 700, "normal"],
  ];
  return Promise.all(
    files.map(async ([family, file, weight, style]) => ({
      family,
      src: await readFile(path.join(fontsDir, file)),
      weight,
      style,
    })),
  );
}
