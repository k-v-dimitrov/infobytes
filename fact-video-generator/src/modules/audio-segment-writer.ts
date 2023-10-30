import path from 'path';
import fs from 'fs';
import { createFileAndWriteBuffer } from '@/utils';

export const writeAudioSegment = async (
  folder: string,
  audioBuffer: Buffer,
  segmentIndex: number
) => {
  const filePath = path.join(folder, `segment-${segmentIndex}.mp3`);
  const writtenFilePath = await createFileAndWriteBuffer(filePath, audioBuffer);
  return writtenFilePath;
};

export const registerAudioSegment = (
  folder: string,
  audioFileSegmentPath: string
) => {
  const fileName = path.join(folder, `segments.txt`);
  fs.appendFileSync(fileName, `file ${path.basename(audioFileSegmentPath)}\n`);
};
