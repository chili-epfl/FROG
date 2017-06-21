#!/bin/bash
# include hidden files (like node_modules/.bin)
shopt -s dotglob

./initial_setup_wo_meteor.sh

cd frog
METEOR=meteor
which meteor | grep -qw meteor || METEOR=/usr/local/bin/meteor
$METEOR npm install --allow-superuser
