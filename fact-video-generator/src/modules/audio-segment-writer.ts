import path from 'path';
import fs from 'fs';
import { createFileAndWriteBuffer, log } from '@/utils';

export const writeAudioSegment = async (
  folder: string,
  audioBuffer: Buffer,
  segmentIndex: number
) => {
  log('AUDIO_SEGMENT', `Writing audio segment...`);

  const filePath = path.join(folder, `segment-${segmentIndex}.mp3`);
  const writtenFilePath = await createFileAndWriteBuffer(filePath, audioBuffer);

  log('AUDIO_SEGMENT', `Finished Writing audio segment!`);
  return writtenFilePath;
};

export const registerAudioSegment = (
  folder: string,
  audioFileSegmentPath: string
) => {
  const fileName = path.join(folder, `segments.txt`);
  fs.appendFileSync(fileName, `file ${path.basename(audioFileSegmentPath)}\n`);
  log('AUDIO_SEGMENT', `Registered audio segment!`);
};
