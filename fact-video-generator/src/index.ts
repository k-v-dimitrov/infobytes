import knex from 'knex';

import dotenv from 'dotenv';
dotenv.config();

// const {
//   FPS: configFPS,
//   VIDEO_WIDTH: configVideoWidth,
//   VIDEO_HEIGHT: configVideoHeight,
// } = process.env;

// const FPS = Number.parseInt(configFPS);
// const VIDEO_WIDTH = Number.parseInt(configVideoWidth);
// const VIDEO_HEIGHT = Number.parseInt(configVideoHeight);
// const FRAMES_OUTPUT_DIR = './frames';

// TODO: Pull fact from DB
// create temp folder with fact name
// break down text to subtitles: no more than 60 characters, break on , and .!
// generate audio files with ttstool
// save them to temp folder
// call video-renderer
async function main() {
  const db = knex({
    client: 'pg',
    connection:
      'postgresql://kiril:123456@localhost:5432/infobytes?schema=public',
  });

  const a = db.queryBuilder();
  const allFacts = await a.select('*').from('facts');

  console.log({ allFacts });
}

main();
