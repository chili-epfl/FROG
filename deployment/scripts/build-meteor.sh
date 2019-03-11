#!/bin/bash

#
# builds a production meteor bundle directory
#
set -e

if [ -f $APP_SOURCE_DIR/launchpad.conf ]; then
  source <(grep TOOL_NODE_FLAGS $APP_SOURCE_DIR/launchpad.conf)
fi

# set up npm auth token if one is provided
if [[ "$NPM_TOKEN" ]]; then
  echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" >> ~/.npmrc
fi

cd $APP_SOURCE_DIR

# Install app deps
# printf "\n[-] Running npm install in app directory...\n\n"
# meteor npm install

# build the bundle

mkdir -p $APP_BUNDLE_DIR
# chown -R $USERNAME $APP_BUNDLE_DIR

printf "\n[-] Building Meteor application...\n\n"
$HOME/.meteor/meteor build --directory $APP_BUNDLE_DIR --server-only

# run npm install in bundle
# printf "\n[-] Run3ing npm install in the server bundle...\n\n"
cd $APP_BUNDLE_DIR/bundle/programs/server/
# disabled: meteor npm install --production --verbose

# https://stackoverflow.com/questions/13327088/meteor-bundle-fails-because-fibers-node-is-missing
# The issue about 'Missing binary for fibers'
echo "Binary issue is being resolved dir=$(pwd)"
# su $USERNAME -c 'npm uninstall fibers' 
npm uninstall fibers
npm install fibers --unsafe-perm
