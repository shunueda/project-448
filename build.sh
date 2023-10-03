#!/bin/bash

output=$(ts-node "$1")

IFS=' ' read -r -a ids <<< "$output"

for id in "${ids[@]}"; do
    output_file=out/temp/"$(basename "$id")".mp4
    npx remotion render --props="out/props/$id" --output="$output_file"
    ts-node scripts/bash/attachMetadata.ts "$id"
done
