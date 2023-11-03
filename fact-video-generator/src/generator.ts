import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

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
    const { id: factId } = yargs(hideBin(process.argv)).argv as unknown as {
      id: string;
    };

    if (!factId) {
      throw new Error('FactId was not provided, use --id=[factId]');
    }

    if (!factId) {
      throw new Error('FactId was not provided!');
    }

    const factToProcess = (await db()).getFactById(factId);

    if (!factToProcess) {
      throw new Error(`Could not find fact with id=${factId}`);
    }

    const folder = await makeTempFolder({ prefix: 'video-generator-' });
    const factSubstrings = breakString(factToProcess.text);

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
    const finalVideoFileName = `${factId}.mp4`;

    console.log('------ Results ------');
    console.log('audio: ', folder);
    console.log('frames: ', framesOutputDir);
    console.log('output_dir: ', FINAL_VIDEO_DIR);
    console.log('video_name: ', finalVideoFileName);

    process.exit(0);
  } catch (err) {
    // TODO: clean temp folder
    console.log(err);
    process.exit(-10);
  }
}

main();
