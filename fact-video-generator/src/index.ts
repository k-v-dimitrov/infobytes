import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';

import db from './modules/db';
import { queryTts } from './modules/tts-query';
import {
  registerAudioSegment,
  writeAudioSegment,
} from './modules/audio-segment-writer';

import {
  breakString,
  buildSubtitleSegments,
  getAudioDetailsInDir,
  makeTempFolder,
} from './utils';
import { renderVideo } from './modules/video-renderer';

const {
  FPS: configFPS,
  VIDEO_WIDTH: configVideoWidth,
  VIDEO_HEIGHT: configVideoHeight,
} = process.env;

const FPS = Number.parseInt(configFPS);
const VIDEO_WIDTH = Number.parseInt(configVideoWidth);
const VIDEO_HEIGHT = Number.parseInt(configVideoHeight);
const FRAMES_OUTPUT_DIR = './frames';

async function main() {
  try {
    const allFacts = (await db()).getAllFacts();
    const folder = await makeTempFolder({ prefix: 'video-generator-' });
    const factSubstrings = breakString(allFacts[0].text);
    for (let i = 0; i < factSubstrings.length; i++) {
      const audioBuffer = await queryTts(factSubstrings[i]);
      const writtenAudioFilePath = await writeAudioSegment(
        folder,
        audioBuffer,
        i
      );
      registerAudioSegment(folder, writtenAudioFilePath);
    }
    const { audioFilesDurationsInSeconds, combinedAudioLength } =
      await getAudioDetailsInDir(folder);
    const subtitleSegments = buildSubtitleSegments(
      factSubstrings,
      audioFilesDurationsInSeconds
    );
    const framesOutputDir = path.join(folder, FRAMES_OUTPUT_DIR);
    fs.mkdirSync(framesOutputDir);
    await renderVideo({
      framesOutputDir,
      framesPerSecond: FPS,
      subtitles: subtitleSegments,
      videoHeight: VIDEO_HEIGHT,
      videoWidth: VIDEO_WIDTH,
      combinedAudioLength,
    });

    const { FINAL_VIDEO_DIR } = process.env;

    console.log('------ Results ------');
    console.log('audio: ', folder);
    console.log('video: ', framesOutputDir);
    console.log('output: ', FINAL_VIDEO_DIR);

    process.exit(0);
  } catch (err) {
    console.log(err);
  }
}

main();
