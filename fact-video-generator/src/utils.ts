import fs from 'fs';
import os from 'os';
import path from 'path';
import getAudioDurationInSeconds from 'get-audio-duration';

export async function getAudioFileLength(filePath: string) {
  return parseFloat((await getAudioDurationInSeconds(filePath)).toFixed(2));
}

export async function getAudioDetailsInDir(audioDir: string) {
  const allFilesInAudioDir = fs.readdirSync(audioDir);

  const allAudioFiles = allFilesInAudioDir.filter(
    file => path.extname(file) === '.mp3'
  );

  const audioFilesDurationsInSeconds = await Promise.all(
    allAudioFiles.map(audioFilePath => {
      return getAudioFileLength(`${audioDir}/${audioFilePath}`);
    })
  );

  const combinedAudioLength = parseFloat(
    audioFilesDurationsInSeconds
      .reduce(
        (combinedFilesLength, currentAudioFileLength) =>
          combinedFilesLength + currentAudioFileLength,
        0
      )
      .toFixed(2)
  );

  return {
    audioFilesDurationsInSeconds,
    combinedAudioLength,
  };
}

export function breakString(inputString: string): string[] {
  const sentences = inputString.match(/[^.!?]+[.!?]+/g);

  if (!sentences) {
    return [inputString];
  }

  const brokenSentences: string[] = [];

  sentences.forEach(sentence => {
    if (sentence.length <= 60) {
      brokenSentences.push(sentence.trim());
    } else {
      const midPoint = sentence.lastIndexOf(' ', 60);
      if (midPoint === -1) {
        brokenSentences.push(sentence.substring(0, 60).trim());
        brokenSentences.push(sentence.substring(60).trim());
      } else {
        const firstPart = sentence.substring(0, midPoint + 1).trim();
        const secondPart = sentence.substring(midPoint + 1).trim();

        brokenSentences.push(firstPart);
        brokenSentences.push(secondPart);
      }
    }
  });

  return brokenSentences;
}

interface SubtitleSegment {
  subtitle: string;
  startTime: number;
  endTime: number;
}

export function buildSubtitleSegments(
  factSubstrings: string[],
  audioFilesDurationsInSeconds: number[]
) {
  return audioFilesDurationsInSeconds.reduce<SubtitleSegment[]>(
    (acc, audioDuration, i) => {
      const startTime = i === 0 ? 0 : acc[i - 1].endTime;
      const endTime =
        i === 0 ? audioDuration : acc[i - 1].endTime + audioDuration;

      return [
        ...acc,
        {
          subtitle: factSubstrings[i],
          startTime,
          endTime,
        },
      ];
    },
    []
  );
}

export const createFileAndWriteBuffer = (
  filePath: string,
  audioBuffer: Buffer
) => {
  return new Promise<string>((res, rej) => {
    fs.createWriteStream(filePath).write(audioBuffer, err => {
      if (err) {
        rej(err);
      }

      res(filePath);
    });
  });
};

export const makeTempFolder = async ({ prefix }: { prefix: string }) => {
  return new Promise<string>((res, rej) => {
    fs.mkdtemp(path.join(os.tmpdir(), prefix), (err, folder) => {
      if (err) {
        rej(err);
      }

      res(folder);
    });
  });
};
