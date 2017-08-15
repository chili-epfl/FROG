#!/bin/bash

./initial_setup_wo_meteor.sh

mkdir frog/node_modules
ln -s `pwd`/node_modules/* frog/node_modules/
