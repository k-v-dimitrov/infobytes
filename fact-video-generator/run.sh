program_output=$(yarn && yarn build && cp .env ./dist/.env && yarn start)
audio_path=$(echo "$program_output" | grep "audio:" | awk '{print $2}')
frames_path=$(echo "$program_output" | grep "video:" | awk '{print $2}')
output_path=$(echo "$program_output" | grep "output:" | awk '{print $2}')

echo $audio_path, $frames_path, $output_path

ffmpeg -f concat -safe 0 -i "$audio_path/segments.txt" "$audio_path/generated-audio.mp3"
ffmpeg -y -framerate 25 -i "$frames_path/frame-%d.png" -i "$audio_path/generated-audio.mp3" -c:v libx264 -pix_fmt yuv420p "$output_path/out.mp4"

# Clean temp folder
echo "--- Cleaning temp folder $audio_path"
# rm -rf $audio_path

