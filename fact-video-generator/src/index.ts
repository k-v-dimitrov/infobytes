import * as fs from 'fs';
import path from 'path';
import Konva from 'konva';

const OUTPUT_DIR = './frames';
const FPS = 25;
const VIDEO_WIDTH = 1080;
const VIDEO_HEIGHT = 1920;

const videoLength = 10; // in seconds
const frameLength = videoLength * FPS;

async function renderFrame(currentFrame: number) {
  //@ts-expect-error
  const stage = new Konva.Stage({
    width: VIDEO_WIDTH,
    height: VIDEO_HEIGHT,
  });

  const layer1 = new Konva.Layer();

  const currentSecond = currentFrame / FPS;

  const rect = new Konva.Rect({
    width: VIDEO_WIDTH,
    height: VIDEO_HEIGHT,
    fill: `black`,
  });

  const TEXTBOX_WIDTH = 975;

  const textBox = new Konva.Text({
    text:
      currentSecond < 5
        ? 'The Great Wall of China is the longest wall in the world,'
        : 'stretching over 13,000 miles.',
    fontSize: 140,
    fontFamily: 'Helvetica',
    fill: 'white',
    width: TEXTBOX_WIDTH,
    align: 'center',
  });

  const TEXTBOT_HEIGHT = textBox.getHeight();

  textBox.setPosition({
    x: VIDEO_WIDTH / 2 - TEXTBOX_WIDTH / 2,
    y: VIDEO_HEIGHT / 2 - TEXTBOT_HEIGHT / 2,
  });

  layer1.add(rect);
  layer1.add(textBox);
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

async function main() {
  for (let i = 0; i < frameLength; i++) {
    await renderFrame(i);
  }
}

main();

// ANIMATION PREPARATION
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
