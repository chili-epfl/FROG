#!/bin/bash

FROG=`pwd`

cd $FROG/frog-utils
npm run watch &

for dir in $FROG/ac/ac-*/ $FROG/op/op-*/
do
    cd $dir
    npm run watch &
done

cd $FROG/frog

