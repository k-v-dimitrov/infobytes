import { log, spawnPromise } from '@/utils';
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
  tempFolderPath: string;
}

export async function renderVideo({
  combinedAudioLength,
  framesOutputDir,
  framesPerSecond,
  videoHeight,
  videoWidth,
  subtitles,
  tempFolderPath,
}: RenderVideoParams) {
  log('VIDEO_RENDERER', 'Started video rendering...');
  const videoLength = combinedAudioLength;

  const frames = new Array(Math.ceil(videoLength * framesPerSecond))
    .fill('')
    .map((_, i) => i + 1);

  const chunkSize = 10;
  for (let i = 0; i < frames.length; i += chunkSize) {
    const chunk = frames.slice(i, i + chunkSize);

    const renderingChunk = chunk.map(currentFrame => {
      return spawnPromise(
        `yarn start:frame-renderer --params=${JSON.stringify(
          JSON.stringify({
            tempFolderPath,
            currentFrame,
            options: {
              frameOutputDir: framesOutputDir,
              framesPerSecond,
              videoHeight,
              videoWidth,
            },
            subtitles,
          })
        )}`,
        false,
        { shell: true }
      );
    });

    await Promise.all(renderingChunk);
    log('VIDEO_RENDERER', `Frames ${i} / ${frames.length} done!`);
  }

  log('VIDEO_RENDERER', 'Finished rendering video!');
}
