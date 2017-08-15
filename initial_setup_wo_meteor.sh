#!/bin/bash

shopt -s dotglob

FROG=`pwd`
if (( $(yarn --version) ~= "0.28.4" )); then 
    YARN=yarn
else
    npm install yarn@0.28.4 & YARN=$FROG/node_modules/.bin/yarn
fi

mkdir frog/node_modules

$YARN install


cd frog-utils
ln -s $FROG/.babelrc . 2>/dev/null
npm run build &

# install activities and operators packages
for dir in $FROG/ac/ac-*/ $FROG/op/op-*/
do
    cd $dir
    ln -s $FROG/.babelrc . 2>/dev/null
    npm run build &
done

cd $FROG/frog
ln -s $FROG/node_modules/* node_modules/ 2>/dev/null
ln -s $FROG/.babelrc . 2>/dev/null

exit 0
