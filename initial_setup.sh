#!/bin/bash

./initial_setup_wo_meteor.sh

cd frog
METEOR=meteor
which meteor | grep -qw meteor || METEOR=/usr/local/bin/meteor
$METEOR npm install -g yarn 
$METEOR yarn install
