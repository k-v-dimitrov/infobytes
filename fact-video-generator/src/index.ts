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
  console.log('Pulling facts from db...');
  const allFacts = (await db()).getAllFacts();
  console.log('Finished pulling facts from db!');
  const folder = await makeTempFolder({ prefix: 'video-generator-' });
  console.log(`Generated temp folder: ${folder}`);
  const factSubstrings = breakString(allFacts[0].text);
  console.log(`Finished breaking fact to substrings!`);
  for (let i = 0; i < factSubstrings.length; i++) {
    console.log(`Querying TTS for fact substring No. ${i + 1}`);
    const audioBuffer = await queryTts(factSubstrings[i]);
    console.log(`Finished Querying TTS!`);
    console.log(`Writing audio segment...`);
    const writtenAudioFilePath = await writeAudioSegment(
      folder,
      audioBuffer,
      i
    );
    console.log(`Finished Writing audio segment!`);
    registerAudioSegment(folder, writtenAudioFilePath);
    console.log(`Registered audio segment!`);
  }
  console.log(`Getting audio details...`);
  const { audioFilesDurationsInSeconds, combinedAudioLength } =
    await getAudioDetailsInDir(folder);
  console.log(`Finished getting audio details!`);
  const subtitleSegments = buildSubtitleSegments(
    factSubstrings,
    audioFilesDurationsInSeconds
  );
  console.log(`Built subtitle segments!`);
  const framesOutputDir = path.join(folder, FRAMES_OUTPUT_DIR);
  fs.mkdirSync(framesOutputDir);
  console.log(`Started rendering frames...`);
  await renderVideo({
    framesOutputDir,
    framesPerSecond: FPS,
    subtitles: subtitleSegments,
    videoHeight: VIDEO_HEIGHT,
    videoWidth: VIDEO_WIDTH,
    combinedAudioLength,
  });
  console.log(`Finished rendering frames for ${allFacts[0].title}!`);
}

main();
