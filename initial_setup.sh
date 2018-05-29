#!/bin/bash

shopt -s dotglob

FROG="`pwd`"
YARN_VERSION='1.7.0'
if which yarn && [[ `yarn --version` == $YARN_VERSION ]]; then 
    echo 'Using pre-installed global Yarn'; YARN=yarn 
else
    if [ -f "$FROG/node_modules/.bin/yarn" ] && [[ `"$FROG/node_modules/.bin/yarn" --version` == $YARN_VERSION ]]; then 
        echo 'Using pre-installed local Yarn'; YARN="$FROG/node_modules/.bin/yarn"
    else
        echo 'Installing Yarn'; npm install yarn@$YARN_VERSION && YARN="$FROG/node_modules/.bin/yarn"
    fi
fi
echo "Yarn: $YARN"

"$YARN" install
rm -rf frog/node_modules
ln -s `pwd`/node_modules frog

echo 
echo -e "\xE2\x9C\xA8  Finished Initial Setup."
echo -e "\xF0\x9F\xA4\x93  Run ${LBLUE}npm start server ${NC}to begin hacking!"

exit 0
