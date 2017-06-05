#!/bin/bash

FROG=`pwd`
yarn upgrade-interactive
cd $FROG/frog-utils
yarn upgrade-interactive

for dir in $FROG/ac/ac-*/ $FROG/op/op-*/
do
    cd $dir
    yarn upgrade-interactive
done

cd $FROG/frog
outdated
meteor update
