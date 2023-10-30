import * as fs from 'fs';
import path from 'path';
import { renderFrame } from './frame-renderer';
import { getAudioFileLength } from '../utils';
import { saveFrame } from './frame-saver';

interface RenderVideoParams {
  framesPerSecond: number;
  framesOutputDir: string;
  videoWidth: number;
  videoHeight: number;
  outputDir: string;
  audioDir: string;
  subtitles: Array<Subtitle>;
}

async function renderVideo({
  framesOutputDir,
  framesPerSecond,
  videoHeight,
  videoWidth,
  audioDir,
  subtitles,
}: RenderVideoParams) {
  const allFilesInAudioDir = fs.readdirSync(audioDir);

  const allAudioFiles = allFilesInAudioDir.filter(
    file => path.extname(file) === 'mp3'
  );

  const allAudioFilesLengths = await Promise.all(
    allAudioFiles.map(audioFilePath => {
      return getAudioFileLength(`${audioDir}/${audioFilePath}`);
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

  const videoLength = combinedAudioLength;
  const frameLength = videoLength * framesPerSecond;

  for (let currentFrame = 0; currentFrame < frameLength; currentFrame++) {
    const renderedFrame = await renderFrame({
      currentFrame,
      options: {
        frameOutputDir: framesOutputDir,
        framesPerSecond,
        videoHeight,
        videoWidth,
      },
      subtitles,
    });

    await saveFrame({
      outputDir: framesOutputDir,
      frameDataUrl: renderedFrame,
      frameIndex: currentFrame,
    });
  }
}
