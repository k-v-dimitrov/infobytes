import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { spawnPromise } from './utils';

async function main() {
  const preHook = execSync('yarn start:hook:pre', { encoding: 'utf-8' });

  const factIdsToProcess = preHook
    .split('\n')
    .map(fc => fc.includes('fact-id') && fc.split(' ')[1])
    .filter(d => d);

  for (const factId of factIdsToProcess) {
    try {
      // const generatorOutput = execSync(`yarn start:generator --id=${factId}`, {
      //   encoding: 'utf-8',
      //   stdio: 'inherit',
      // });

      const generatorOutput = await spawnPromise(
        `yarn start:generator --id=${factId}`,
        { shell: true }
      );

      const audioPath = path.resolve(generatorOutput.match(/audio:\s*(.+)/)[1]);
      const framesPath = path.resolve(
        generatorOutput.match(/frames:\s*(.+)/)[1]
      );
      const outputDir = path.resolve(
        generatorOutput.match(/output_dir:\s*(.+)/)[1]
      );
      const videoName = generatorOutput.match(/video_name:\s*(.+)/)[1];

      if (!fs.existsSync(outputDir)) {
        console.log(outputDir);
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(`Folder '${outputDir}' did not exist, so it was created.`);
      }

      execSync(
        `ffmpeg -f concat -safe 0 -i "${audioPath}/segments.txt" "${audioPath}/generated-audio.mp3"`,
        { stdio: 'inherit' }
      );
      execSync(
        `ffmpeg -y -framerate 25 -i "${framesPath}/frame-%d.png" -i "${audioPath}/generated-audio.mp3"` +
          ` -c:v libx264 -pix_fmt yuv420p "${outputDir}/${videoName}"`,
        { stdio: 'inherit' }
      );

      console.log(`--- Cleaning temp folder ${audioPath}`);
      fs.rmdirSync(audioPath, { recursive: true });

      execSync(
        `yarn start:hook:post --videoPath=${outputDir}/${videoName} --factId=${factId}`,
        {
          stdio: 'inherit',
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
}

main();
