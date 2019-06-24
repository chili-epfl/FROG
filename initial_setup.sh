#!/bin/bash

if [ -d "frog/node_modules" ]; then
  echo "Please run git clean -fdx before running initial_setup.sh"
  exit 0
fi
shopt -s dotglob

FROG="`pwd`"
YARN_VERSION='1.16'
if which yarn && [[ `yarn --version` == $YARN_VERSION ]]; then
    echo 'Using pre-installed global Yarn'; YARN=yarn
else
    if [ -f "$FROG/node_modules/.bin/yarn" ] && [[ `"$FROG/node_modules/.bin/yarn" --version` == $YARN_VERSION ]]; then
        echo 'Using pre-installed local Yarn'; YARN="$FROG/node_modules/.bin/yarn"
    else
        echo 'Installing Yarn'; npm install yarn@$YARN_VERSION --no-package-lock && YARN="$FROG/node_modules/.bin/yarn"
    fi
fi
echo "Yarn: $YARN"

"$YARN" install
rm -rf frog/node_modules
ln -s `pwd`/node_modules frog
ln -s frog/babel.config.js .
node linkFiles.js

echo
echo -e "\xE2\x9C\xA8  Finished Initial Setup."
echo -e "\xF0\x9F\xA4\x93  Run ${LBLUE}npm start server ${NC}to begin hacking!"

exit 0
