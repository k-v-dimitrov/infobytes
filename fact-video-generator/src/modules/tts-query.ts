import fetch from 'node-fetch';
import { log } from '@/utils';

export const queryTts = async (textToConvert: string) => {
  log('TTS', `Querying TTS...`);

  const audioIdRaw = await fetch(
    'https://support.readaloud.app/ttstool/createParts',
    {
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        'sec-ch-ua':
          '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Linux"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        Referer: 'https://ttstool.com/',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      method: 'POST',
      // eslint-disable-next-line max-len
      body: `[{"voiceId":"Amazon British English (Brian)","ssml":"<speak version=\\"1.0\\" xml:lang=\\"en-GB\\">${textToConvert}</speak>"}]`,
    }
  );

  const [audioId] = (await audioIdRaw.json()) as string[];

  const audioRaw = await fetch(
    `https://support.readaloud.app/ttstool/getParts?q=${audioId}`,
    {
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9',
        range: 'bytes=0-',
        'sec-ch-ua':
          '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Linux"',
        'sec-fetch-dest': 'audio',
        'sec-fetch-mode': 'no-cors',
        'sec-fetch-site': 'cross-site',
        Referer: 'https://ttstool.com/',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      method: 'GET',
    }
  );

  const audioBuffer = await audioRaw.buffer();

  log('TTS', `Finished Querying TTS!`);

  return audioBuffer;
};
