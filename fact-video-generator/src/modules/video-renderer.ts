import { log } from '@/utils';
import { renderFrame } from './frame-renderer';
import { saveFrame } from './frame-saver';

interface Subtitle {
  subtitle: string;
  startTime: number;
  endTime: number;
}

interface RenderVideoParams {
  framesPerSecond: number;
  framesOutputDir: string;
  videoWidth: number;
  videoHeight: number;
  subtitles: Array<Subtitle>;
  combinedAudioLength: number;
}

export async function renderVideo({
  combinedAudioLength,
  framesOutputDir,
  framesPerSecond,
  videoHeight,
  videoWidth,
  subtitles,
}: RenderVideoParams) {
  log('VIDEO_RENDERER', 'Started video rendering...');
  const videoLength = combinedAudioLength;

  const frames = new Array(Math.ceil(videoLength * framesPerSecond)).fill('');

  const renderFramePromises = frames.map(async (_, currentFrame) => {
    log('VIDEO_RENDERER', `   Rendering frame ${currentFrame}...`);
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
  });

  await Promise.all(renderFramePromises);

  log('VIDEO_RENDERER', 'Finished rendering video!');
}
