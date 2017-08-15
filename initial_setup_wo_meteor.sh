#!/bin/bash

shopt -s dotglob

FROG=`pwd`
YARN_VERSION='0.28.1'
if which yarn && [[ `yarn --version` == $YARN_VERSION ]]; then 
    echo 'Using pre-installed global Yarn'; YARN=yarn 
else
    if [ -f $FROG/node_modules/.bin/yarn ] && [[ `$FROG/node_modules/.bin/yarn --version` == $YARN_VERSION ]]; then 
        echo 'Using pre-installed local Yarn'; YARN=$FROG/node_modules/.bin/yarn 
    else
        echo 'Installing Yarn'; npm install yarn@$YARN_VERSION && YARN=$FROG/node_modules/.bin/yarn
    fi
fi
echo "Yarn: $YARN"

$YARN install

cd frog-utils
ln -s $FROG/.babelrc . 2>/dev/null
$YARN run build 

# install activities and operators packages
for dir in $FROG/ac/ac-*/ $FROG/op/op-*/
do
    cd $dir
    ln -s $FROG/.babelrc . 2>/dev/null
    $YARN run build 
done

cd $FROG/frog
ln -s $FROG/node_modules/* node_modules/ 2>/dev/null
ln -s $FROG/.babelrc . 2>/dev/null

exit 0
