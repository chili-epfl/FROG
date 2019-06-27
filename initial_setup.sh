#!/bin/bash
if [ -d "frog/node_modules" ]; then
  echo "Please run git clean -fdx before running initial_setup.sh"
  exit 0
fi
shopt -s dotglob

if ! PYTHON_VERSION=$(python --version);
then
    echo "Cannot find Python, please install python 2 and try again"
    exit 1
fi

if ! python -c 'import sys; print(sys.version_info[0] == 2)' > /dev/null == 'True';
then
    echo "Cannot find Python 2, Please install Python 2 and try again"
    exit 1
fi
    
YARN_VERSION='1.15.2'
if which yarn && [[ `yarn --version` == $YARN_VERSION ]]; then
    echo 'Using pre-installed global Yarn'; YARN=yarn
else
    if [ -f "./node_modules/.bin/yarn" ] && [[ `./node_modules/.bin/yarn --version` == $YARN_VERSION ]]; then
        echo 'Using pre-installed local Yarn'; YARN="./node_modules/.bin/yarn"
    else
        echo 'Installing Yarn'; npm install yarn@$YARN_VERSION --no-package-lock && YARN="./node_modules/.bin/yarn"
    fi
fi
echo "Yarn: $YARN"

if ! "$YARN" install; then
	echo "Sorry, there seems to be something wrong, please correct the errors and try again"
	echo "There was some error installing the required packages, please rectify the errors and try again"
    exit 1
fi
rm -rf frog/node_modules
ln -s `pwd`/node_modules frog
ln -s frog/babel.config.js .
node linkFiles.js

echo
echo -e "\xE2\x9C\xA8  Finished Initial Setup."
echo -e "\xF0\x9F\xA4\x93  Run ${LBLUE}npm start server ${NC}to begin hacking!"
exit 0
