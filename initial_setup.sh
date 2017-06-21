#!/bin/bash
SAVEIFS=$IFS
IFS=$(echo -en "\n\b")
# include hidden files (like node_modules/.bin)
shopt -s dotglob

./initial_setup_wo_meteor.sh

METEOR=meteor
which meteor | grep -qw meteor || METEOR=/usr/local/bin/meteor
$METEOR npm install --allow-superuser

IFS=$SAVEIFS
