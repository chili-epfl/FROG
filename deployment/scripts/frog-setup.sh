#!/bin/bash

set -e

olddir=$(pwd)

cd $APP_SOURCE_WRAPPER_DIR
echo "Initial setup is being started with dir=$(pwd)"

# dockerignore does not ignore symlinked directories, that's why, it should be deleted before initial_setup 
rm -rf frog/node_modules

npm install rimraf
bash ./initial_setup.sh

printf "Initial setup ended frog-utils check results... \n $(find . -name frog-utils)"

cd $olddir