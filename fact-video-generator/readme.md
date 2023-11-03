# Fact Video Generator

The generator is comprised of three main components: the pre-hook, the video generator, and the post-hook. Additionally, there is a main `index.ts` file that acts as the driver, coordinating the flow between these components. 

## Pre-Hook

The pre-hook's primary responsibility is to extract facts from the provided database. It will then log each fact's unique ID on separate lines in the console so they can later be parsed by the main driver.

## Main Driver (index.ts)

The main driver plays a role in managing the entire video generation process. It takes the output from the pre-hook, parses its output and orchestrates the subsequent steps.

## Video Generator

The video generator performs the most complex tasks in the process, transforming text-based facts into video content. Here's a breakdown of what it does:

1. **Temporary Folder Creation**: The generator creates a temporary directory in `/tmp` to store temporary files necessary for video generation.

2. **Subtitle Creation**: It breaks down the text of each fact into subtitles. Each subtitle is limited to less than 60 characters and is split at any comma or full stop.

3. **Audio Generation**: The generator queries a text-to-speech (TTS) tool to create audio for each subtitle. These audio files are saved in the temporary directory under `/audio`. Additionally, it registers (writes) the corresponding audio file name  to `segments.txt`, which is needed by ffmpeg for merging the generated audio files.

4. **Subtitle Timestamps**: The generator builds a `subtitleSegments` object that contains the subtitle, its start and end time timestamps. This information is later used by the frame renderer to determine when and which subtitles to display.

5. **Video Rendering**: The video renderer calculates the video length based on the combined audio files' duration. It then spawns multiple processes (currently set to 10) to parallelize the frame rendering process. The output frames are saved under the `tmp/frames` directory.

## FFmpeg Processing

After frame rendering is complete, the main driver parses the results from the `video-renderer` and utilizes FFmpeg to complete the video generation process. This step combines the audio and frames to create the final video. Here's the ffmpeg commands:

audio:
```bash
ffmpeg -f concat -safe 0 -i "${audioPath}/segments.txt" "${audioPath}/generated-audio.mp3"
```

video:
```bash
ffmpeg -y -framerate 25 -i "${framesPath}/frame-%d.png" -i "${audioPath}/generated-audio.mp3" -c:v libx264 -pix_fmt yuv420p "${outputDir}/${videoName}"
```

Once the FFmpeg processing is complete, you will have the generated video in the provided output path specified in your .env file. It will also delete the temp folder at this point.

## Post-Hook

The post-hook is responsible for uploading the generated videos to an S3 bucket and cleaning up the output folder. 

## Scripts and development guidelines

**NOTE: Some of the development commands require a fresh build to be present since they rely on builded scripts. This was a side effect of introducing child_processes to optimize the generator.**

`yarn dev`: This will run the main driver which does not require any additional parameters to be specified. However it is highly unsuitable for development purposes. For more fine grained development identify which component you want developed. **Requires all secondary modules to be built**

`yarn dev:generator --id=[fact-id]`: To run the generator you must provide a valid fact-id from the target DB specified in .env. **Requires at least the frame-renderer module to be built**

`yarn dev:hook:pre`: The pre-hook does not require any additional arguments but will use the target DB specified in .env. 

`yarn dev:hook:post --videoPath=[path-to-generated-video] --factId=[fact-id]`: The post hook requires a path to the generated video and again a valid fact-id from the target DB specified in .env.

`yarn dev:frame-renderer --params=[frame-renderer-params]`: The frame renderer is the hardest to run in a development environment but probably the most useful one. You must provide `frame-renderer-params` which is a stringified and **escaped** json object which must satisfy the `RenderFrameParams` interface:

```typescript
interface RenderFrameParams {
  currentFrame: number;
  subtitles: Array<Subtitle>;
  options: Options;
}

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
```

`start`: Runs the builded main driver

**NOTE: Running anything other than `yarn start` for the builded version is wrong. The main driver is responsible for orchestrating all subsequent invocations.**

`start:generator`: Runs the builded generator.

`start:frame-renderer`: Runs the builded frame renderer 

`start:hook:pre`: Runs the builded pre hook

`start:hook:post`: Runs the builded post hook


## Running builded version

Make sure to adjust .env.

`yarn && yarn build && yarn start`

## TODO

- [ ] Fix video length calculation: For some reason the calculated video length is a bit higher than the end timestamp of the last subtitle fragment. It is currently patched by handling undefined current subtitle for displaying:

`frame-renderer:54`
```typescript
  const subtitle = subtitles.find(
    stm => currentSecond < stm.endTime && currentSecond >= stm.startTime
  )?.subtitle;
```

- [ ] Add video padding - e.g. start displaying subtitles and play audio 0.5s after the start or the end of the video.
- [ ] Create new module for querying deep-infra or other Stable Diffusion model to generate background image for the fact.
- [ ] Utilize the background image in `frame-renderer`
- [ ] Add support for background image effect - blur or other effect to make the text pop out. 
