#!/bin/bash
FROG=`pwd`

# install package frog-utils
cd $FROG/frog-utils
npm install
npm link

# install activities and operators packages
for dir in $FROG/ac/ac-*/ $FROG/op/op-*/
do
    cd $dir
    npm link frog-utils
    npm install
    npm link
done

# links all packages to the frog/ meteor project
cd $FROG/frog
npm link frog-utils
for dir in `ls $FROG/ac |grep 'ac'` `ls $FROG/op |grep 'op'`
do
    npm link $dir
done

npm install --python=python2.7
