import * as fs from 'fs';
import dotenv from 'dotenv';
import { renderFrame } from './modules/render';
import { getAudioFileLength } from './utils';
dotenv.config();

const OUTPUT_DIR = './frames';

const {
  FPS: configFPS,
  VIDEO_WIDTH: configVideoWidth,
  VIDEO_HEIGHT: configVideoHeight,
} = process.env;

const FPS = Number.parseInt(configFPS);
const VIDEO_WIDTH = Number.parseInt(configVideoWidth);
const VIDEO_HEIGHT = Number.parseInt(configVideoHeight);

async function main() {
  const allAudioFiles = fs.readdirSync('./audio');

  const allAudioFilesLengths = await Promise.all(
    allAudioFiles.map(audioFilePath => {
      return getAudioFileLength(`./audio/${audioFilePath}`);
    })
  );

  const combinedAudioLength = parseFloat(
    allAudioFilesLengths
      .reduce(
        (combinedFilesLength, currentAudioFileLength) =>
          combinedFilesLength + currentAudioFileLength,
        0
      )
      .toFixed(2)
  );

  const subtitleTimestampMap = allAudioFilesLengths.reduce<
    {
      subtitle: string;
      startTime: number;
      endTime: number;
    }[]
  >((acc, audioLength, i) => {
    return [
      ...acc,
      {
        subtitle:
          i === 0
            ? 'The Great Wall of China is the longest wall in the world,'
            : ' stretching over 13,000 miles.',
        startTime: i === 0 ? 0 : acc[i - 1].endTime,
        endTime: i === 0 ? audioLength : acc[i - 1].endTime + audioLength,
      },
    ];
  }, []);

  const videoLength = combinedAudioLength;
  const frameLength = videoLength * FPS;

  for (let i = 0; i < frameLength; i++) {
    await renderFrame({
      currentFrame: i,
      options: {
        frameOutputDir: OUTPUT_DIR,
        framesPerSecond: FPS,
        videoHeight: VIDEO_HEIGHT,
        videoWidth: VIDEO_WIDTH,
      },
      subtitles: subtitleTimestampMap,
    });
  }
}

main();
