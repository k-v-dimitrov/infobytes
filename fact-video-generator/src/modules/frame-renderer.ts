import Konva from 'konva';

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
  currentFrame: number;
  subtitles: Array<Subtitle>;
  options: Options;
}

export async function renderFrame({
  currentFrame,
  subtitles,
  options: { videoHeight, videoWidth, framesPerSecond },
}: RenderFrameParams) {
  //@ts-expect-error
  const stage = new Konva.Stage({
    width: videoWidth,
    height: videoHeight,
  });

  const layer1 = new Konva.Layer();

  const currentSecond = currentFrame / framesPerSecond;

  const rect = new Konva.Rect({
    width: videoWidth,
    height: videoHeight,
    fill: `black`,
  });

  const TEXTBOX_WIDTH = 975;

  const { subtitle } = subtitles.find(
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
    x: videoWidth / 2 - TEXTBOX_WIDTH / 2,
    y: videoHeight / 2 - TEXTBOT_HEIGHT / 2,
  });

  layer1.add(rect);
  layer1.add(textBox);
  stage.add(layer1);

  const stageData = stage.toDataURL();

  // Release memory to prevent build up
  stage.destroy();

  return stageData;
}
