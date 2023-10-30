import getAudioDurationInSeconds from 'get-audio-duration';

export async function getAudioFileLength(filePath: string) {
  return parseFloat((await getAudioDurationInSeconds(filePath)).toFixed(2));
}
