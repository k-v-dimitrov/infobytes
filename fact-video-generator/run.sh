# Prepare
yarn && yarn build && cp .env ./dist/.env

pre_hook_output=$(yarn start:hook:pre | grep "fact-id:" | awk '{print $2}')

while IFS= read -r line; do
  # Run the command with the current line as the ID
  program_output=$(yarn start --id=$line 2>&1 | tee /dev/tty)
  audio_path=$(echo "$program_output" | grep "audio:" | awk '{print $2}')
  frames_path=$(echo "$program_output" | grep "video:" | awk '{print $2}')
  output_path=$(echo "$program_output" | grep "output:" | awk '{print $2}')

  if [ ! -d "$output_path" ]; then
  # output_path directory does not exist, so create it
    mkdir "$output_path"
    echo "Folder '$output_path' did not exists so it was created."
  fi

  ffmpeg -f concat -safe 0 -i "$audio_path/segments.txt" "$audio_path/generated-audio.mp3"
  ffmpeg -y -framerate 25 -i "$frames_path/frame-%d.png" -i "$audio_path/generated-audio.mp3" -c:v libx264 -pix_fmt yuv420p "$output_path/out.mp4"

  # Clean temp folder
  echo "--- Cleaning temp folder $audio_path"
  rm -rf $audio_path
  
  yarn start:hook:post

  # echo "--- Cleaning output folder $output_path"
  # rm -rf $output_path
done <<< "$pre_hook_output"


