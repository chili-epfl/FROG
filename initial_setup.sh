#!/bin/bash
FROG=`pwd`

yarn install

# install package frog-utils
cd $FROG/frog-utils
mkdir -p node_modules
ln -s $FROG/node_modules/* node_modules/
yarn install

# install activities and operators packages
for dir in $FROG/ac/ac-*/ $FROG/op/op-*/
do
    cd $dir
    mkdir -p node_modules
    ln -s $FROG/node_modules/* node_modules/
    ln -s $FROG/frog-utils node_modules/
    yarn install
done

# links all packages to the frog/ meteor project
cd $FROG/frog
mkdir -p node_modules
ln -s $FROG/node_modules/* node_modules/
ln -s $FROG/frog-utils node_modules/
for dir in `ls $FROG/ac |grep 'ac'` `ls $FROG/op |grep 'op'`
do
    ln -s $dir node_modules/
done

yarn install

