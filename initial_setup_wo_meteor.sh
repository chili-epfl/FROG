#!/bin/bash

shopt -s dotglob

FROG="`pwd`"
YARN_VERSION='1.3.2'
if which yarn && [[ `yarn --version` == $YARN_VERSION ]]; then 
    echo 'Using pre-installed global Yarn'; YARN=yarn 
else
    if [ -f "$FROG/node_modules/.bin/yarn" ] && [[ `"$FROG/node_modules/.bin/yarn" --version` == $YARN_VERSION ]]; then 
        echo 'Using pre-installed local Yarn'; YARN="$FROG/node_modules/.bin/yarn"
    else
        echo 'Installing Yarn'; npm install yarn@1.3.2 && YARN="$FROG/node_modules/.bin/yarn"
    fi
fi
echo "Yarn: $YARN"

"$YARN" install

cd frog-utils
ln -s "$FROG/.babelrc" . 2>/dev/null
../node_modules/.bin/nps build . 2>/dev/null &

# install activities and operators packages
for dir in "$FROG"/ac/ac-*/ "$FROG"/op/op-*/
do
    cd "$dir"
    ln -s "$FROG/.babelrc" . 2>/dev/null
    ../../node_modules/.bin/nps build . 2>/dev/null &
done

cd "$FROG/frog"
ln -s "$FROG"/node_modules/* node_modules/ 2>/dev/null
ln -s "$FROG/.babelrc" . 2>/dev/null
wait
echo Initial setup complete, cd to './frog' and run 'meteor'. 
echo Run 'npm watchAll' to begin recompiling code from all the 
echo other packages.
exit 0
