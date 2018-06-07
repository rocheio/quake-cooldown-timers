#!/bin/sh
set -e

# Load AWS creds from an env file
set -a && . .env

FILES="
    index.html
    style.css
    script.js
    media/heavy-armor.png
    media/mega-health.png
    media/protection.png
    media/quad-damage.png
"

for file in $FILES; do
    aws s3 cp $file s3://$S3_BUCKET/$file
done
