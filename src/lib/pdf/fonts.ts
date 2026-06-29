import path from 'node:path';
import { Font } from '@react-pdf/renderer';

let registered = false;

/** Embed Poppins (Regular/Medium/SemiBold/Bold) into the PDF. Runs once. */
export function registerFonts() {
  if (registered) return;
  const dir = path.join(process.cwd(), 'public', 'fonts');

  Font.register({
    family: 'Poppins',
    fonts: [
      { src: path.join(dir, 'Poppins-Regular.ttf'), fontWeight: 400 },
      { src: path.join(dir, 'Poppins-Medium.ttf'), fontWeight: 500 },
      { src: path.join(dir, 'Poppins-SemiBold.ttf'), fontWeight: 600 },
      { src: path.join(dir, 'Poppins-Bold.ttf'), fontWeight: 700 },
    ],
  });

  // Keep words intact — no mid-word hyphenation in the estimate body.
  Font.registerHyphenationCallback((word) => [word]);

  registered = true;
}
