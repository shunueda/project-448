#!/bin/zsh

dir="trackInfo"

for file in "$dir"/*.json; do
    output_file=out/"$(basename "$file" .json)".mp4
    if [[ ! -f "$output_file" ]]; then
        npx remotion render --props="$file" --output="$output_file"
        git add .
        git commit -m "Add $output_file"
        git push
    else
        echo "$output_file already exists, skipping..."
    fi
done
