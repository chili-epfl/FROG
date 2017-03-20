#!/bin/bash

FROG=`pwd`

yarn outdated

cd $FROG/frog-utils
yarn outdated

for dir in $FROG/ac/ac-*/ $FROG/op/op-*/
do
    cd $dir
    yarn outdated
done

cd $FROG/frog
npm outdated
