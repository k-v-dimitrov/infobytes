import fs from 'fs';
import path from 'path';

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { loadImage } from 'canvas';

import Konva from './konva-helper';
import { saveFrame } from './frame-saver';

interface Subtitle {
  subtitle: string;
  startTime: number;
  endTime: number;
}

interface Options {
  videoWidth: number;
  videoHeight: number;
  framesPerSecond: number;
  frameOutputDir: string;
}

interface RenderFrameParams {
  tempFolderPath: string;
  currentFrame: number;
  subtitles: Array<Subtitle>;
  options: Options;
}

export async function renderFrame() {
  const { params } = yargs(hideBin(process.argv)).argv as unknown as {
    params: string;
  };

  const {
    tempFolderPath,
    currentFrame,
    subtitles,
    options: { videoHeight, videoWidth, framesPerSecond, frameOutputDir },
  } = JSON.parse(params) as RenderFrameParams;

  //@ts-expect-error
  const stage = new Konva.Stage({
    width: videoWidth,
    height: videoHeight,
  });

  const layer1 = new Konva.Layer();
  const layer2 = new Konva.Layer();

  const currentSecond = currentFrame / framesPerSecond;

  const bgImagePath = path.resolve(tempFolderPath, 'bg.png');
  const hasBgImage = fs.existsSync(bgImagePath);

  if (hasBgImage) {
    const loadedImage = await loadImage(bgImagePath);

    const bgImage = new Konva.Image({
      //@ts-ignore
      image: loadedImage,
      width: videoWidth,
      height: videoHeight,
      x: 0,
      y: 0,
    });

    layer1.add(bgImage);
    layer1.draw();
  }

  const rect = new Konva.Rect({
    width: videoWidth,
    height: videoHeight,
    fill: 'black',
    opacity: 0.65,
  });

  layer1.add(rect);
  layer1.draw();

  const TEXTBOX_WIDTH = 975;

  const subtitle = subtitles.find(
    stm => currentSecond < stm.endTime && currentSecond >= stm.startTime
  )?.subtitle;

  const textBox = new Konva.Text({
    text: subtitle,
    fontSize: 140,
    fontFamily: 'Helvetica',
    fill: 'white',
    width: TEXTBOX_WIDTH,
    align: 'center',
  });

  const TEXTBOT_HEIGHT = textBox.getHeight();

  textBox.setPosition({
    x: videoWidth / 2 - TEXTBOX_WIDTH / 2,
    y: videoHeight / 2 - TEXTBOT_HEIGHT / 2,
  });

  layer2.add(textBox);
  layer2.draw();

  stage.add(layer1);
  stage.add(layer2);
  stage.draw();
  const stageData = stage.toDataURL();

  // Release memory to prevent build up
  stage.destroy();

  await saveFrame({
    outputDir: frameOutputDir,
    frameDataUrl: stageData,
    frameIndex: currentFrame,
  });

  process.exit(0);
}

renderFrame();
