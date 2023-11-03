import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';

import { log } from '@/utils';

export const queryStableDiffusion = async (factText: string) => {
  log('BG_QUERY', 'Querying deep-infra for background image...');

  const bgQueryResult = await fetch(
    'https://api.deepinfra.com/v1/inference/prompthero/openjourney?version=7428477dad893424c92f6ea1cc29d45f6d1448c1',
    {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9,bg;q=0.8',
        'content-type': 'application/json',
        'sec-ch-ua':
          '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Linux"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        Referer: 'https://chat.deepinfra.com/',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: `{"prompt":"${factText}","height":960}`,
      method: 'POST',
    }
  );

  const jsonRes = await bgQueryResult.json();

  if (jsonRes.inference_status.status !== 'succeeded') {
    throw new Error(
      `Could not generate image... \n\n ${JSON.stringify(jsonRes)}`
    );
  }

  // remove the data header
  const base64Data = (jsonRes.images[0] as string).substring(
    'data:image/png;base64,'.length
  );

  log('BG_QUERY', 'Query completed and image was extracted...');

  return base64Data;
};

export const saveBgImage = async (folder: string, base64ImageData: string) => {
  log('BG_QUERY', `Writing generated background image...`);

  const filePathAndName = path.join(folder, `bg.png`);

  try {
    await fs.promises.writeFile(filePathAndName, base64ImageData, 'base64');
  } catch (err) {
    console.log('ERROR WHILE SAVING FILE');
  }

  log('BG_QUERY', `Successfully wrote background image`);

  return filePathAndName;
};
