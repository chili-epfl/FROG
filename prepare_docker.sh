#!/bin/bash

# include hidden files (like node_modules/.bin)
shopt -s dotglob

FROG=`pwd`
FD=`pwd`/.docker
rm -rf $FD
# install package frog-utils
mkdir -p $FD
mkdir -p $FD/frog
mkdir -p $FD/frog-utils
cp $FROG/frog/package.json $FD/frog/
cp $FROG/frog-utils/package.json $FD/frog-utils/

# install activities and operators packages
for dir in $FROG/ac/ac-*/ $FROG/op/op-*/
do
  A=`echo "$dir" | sed -E 's/.+((ac|op)\/.+)/\1/'`
  mkdir -p $FD/$A
  cp $FROG/$A/package.json $FD/$A/package.json
done

