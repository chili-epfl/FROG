#!/bin/bash

shopt -s dotglob

FROG=`pwd`
YARN=yarn
which yarn | grep -qw yarn || npm install yarn@0.28.4
which yarn | grep -qw yarn || YARN=$FROG/node_modules/.bin/yarn
$YARN install

mkdir frog/node_modules

cd frog-utils
ln -s $FROG/.babelrc . 2>/dev/null
npm run build &
ln -s `pwd` $FROG/frog/node_modules/

# install activities and operators packages
for dir in $FROG/ac/ac-*/ $FROG/op/op-*/
do
    cd $dir
    ln -s $FROG/.babelrc . 2>/dev/null
    npm run build &
    ln -s $dir $FROG/frog/node_modules/
done

ln -s $FROG/node_modules/* node_modules/ 2>/dev/null
ln -s $FROG/.babelrc . 2>/dev/null

exit 0
