#!/bin/bash
FROG=`pwd`

yarn install

# install package frog-utils
cd $FROG/frog-utils
mkdir -p node_modules
ln -s $FROG/node_modules/* node_modules/
yarn install
yarn link

# install activities and operators packages
for dir in $FROG/ac/ac-*/ $FROG/op/op-*/
do
    cd $dir
    mkdir -p node_modules
    ln -s $FROG/node_modules/* node_modules/
    yarn link frog-utils
    yarn install
    yarn link
done

# links all packages to the frog/ meteor project
cd $FROG/frog
mkdir -p node_modules
ln -s $FROG/node_modules/* node_modules/
yarn link frog-utils
for dir in `ls $FROG/ac |grep 'ac'` `ls $FROG/op |grep 'op'`
do
    yarn link $dir
done

yarn install

