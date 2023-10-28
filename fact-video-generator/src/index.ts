import path from 'path';
import * as fs from 'fs';

import Konva from 'konva';
// import execa from 'execa';

import shelljs from 'shelljs';

const OUTPUT_DIR = './frames';

const FPS = 25;
const videoLength = 10; // in seconds
const frameLength = videoLength * FPS;

async function renderFrame(currentFrame: number) {
  //@ts-expect-error
  const stage = new Konva.Stage({
    width: 500,
    height: 500,
  });

  const layer1 = new Konva.Layer();

  const rect = new Konva.Rect({
    width: 500,
    height: 500,
    cornerRadius: 36,
    fill: `rgb(${currentFrame}, ${currentFrame}, ${currentFrame})`,
  });

  layer1.add(rect);

  stage.add(layer1);

  saveFrame({ stage, outputDir: OUTPUT_DIR, frame: currentFrame });
}

async function saveFrame({
  stage,
  outputDir,
  frame,
}: {
  stage: Konva.Stage;
  outputDir: string;
  frame: number;
}) {
  const data = stage.toDataURL();

  // remove the data header
  const base64Data = data.substring('data:image/png;base64,'.length);

  const fileNamePadding = Math.floor(Math.log10(frameLength)) + 1;

  const fileName = path.join(
    outputDir,
    `frame-${String(frame + 1).padStart(fileNamePadding, '0')}.png`
  );

  await fs.promises.writeFile(fileName, base64Data, 'base64');
}

async function createVideo() {
  // ffmpeg -framerate 25 -pattern_type glob -i './frames/*.png' -c:v libx264 -pix_fmt yuv420p out.mp4
  // ffmpeg -framerate 25 -pattern_type glob -i './frames/*.png'   -c:v libx264 -pix_fmt yuv420p out.mp4
  // await execa('ffmpeg', [
  //   '-framerate',
  //   String(FPS), // Set the frame rate
  //   '-pattern_type',
  //   'glob', // Specify the pattern type
  //   '-i',
  //   './frames/*.png', // Input file pattern
  //   '-c:v',
  //   'libx264', // Video codec
  //   '-pix_fmt',
  //   'yuv420p', // Pixel format
  //   './out.mp4', // Output file name
  // ]);

  // process.exec;
  shelljs.echo('test');
  shelljs.echo(process.cwd());

  shelljs.config.verbose = true;
  shelljs.exec(
    `cd ${process.cwd()} && ffmpeg -framerate 25 -pattern_type glob -i ./frames/*.png -c:v libx264 -pix_fmt yuv420p out.mp4`
  );
}

async function main() {
  for (let i = 0; i < frameLength; i++) {
    await renderFrame(i);
  }

  await createVideo();
}

main();

// function makeAnimation(
//   callback: (delta: number) => void,
//   { startFrame, duration }: { startFrame: number; duration: number }
// ) {
//   return (frame: number) => {
//     const thisFrame = frame - startFrame;
//     if (thisFrame > 0 && thisFrame <= duration) {
//       callback(thisFrame / duration);
//     }
//   };
// }

// function combineAnimations(
//   ...animations: ((delta: number) => void)[] | undefined
// ) {
//   return (delta: number) => {
//     for (const animation of animations) {
//       if (animation) {
//         animation(delta);
//       }
//     }
//   };
// }
