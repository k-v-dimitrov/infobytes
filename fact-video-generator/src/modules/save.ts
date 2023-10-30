import * as fs from 'fs';
import path from 'path';

export async function saveFrame({
  outputDir,
  frameIndex,
  frameDataUrl,
}: {
  outputDir: string;
  frameIndex: number;
  frameDataUrl: string;
}) {
  // remove the data header
  const base64Data = frameDataUrl.substring('data:image/png;base64,'.length);

  const fileName = path.join(outputDir, `frame-${String(frameIndex + 1)}.png`);

  await fs.promises.writeFile(fileName, base64Data, 'base64');
}
