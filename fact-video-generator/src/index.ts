import * as fs from 'fs';
import path from 'path';
import Konva from 'konva';
import getAudioDurationInSeconds from 'get-audio-duration';

const OUTPUT_DIR = './frames';
const FPS = 25;
const VIDEO_WIDTH = 1080;
const VIDEO_HEIGHT = 1920;

async function renderFrame(
  currentFrame: number,
  subtitleTimestampMap: {
    subtitle: string;
    startTime: number;
    endTime: number;
  }[]
) {
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

  console.log(currentSecond);
  const { subtitle } = subtitleTimestampMap.find(
    stm => currentSecond < stm.endTime && currentSecond >= stm.startTime
  );

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

  const fileName = path.join(outputDir, `frame-${String(frame + 1)}.png`);

  await fs.promises.writeFile(fileName, base64Data, 'base64');
}

async function getAudioFileLength(filePath: string) {
  return parseFloat((await getAudioDurationInSeconds(filePath)).toFixed(2));
}

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
    await renderFrame(i, subtitleTimestampMap);
  }
}

main();
