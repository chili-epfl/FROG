#!/bin/bash
SAVEIFS=$IFS
IFS=$(echo -en "\n\b")
# include hidden files (like node_modules/.bin)
shopt -s dotglob

FROG=`pwd`
YARN=yarn
which yarn | grep -qw yarn || npm install yarn@0.24.6
which yarn | grep -qw yarn || YARN=$FROG/node_modules/.bin/yarn
$YARN install

# install package frog-utils
cd $FROG/frog-utils
mkdir -p node_modules
ln -s $FROG/node_modules/* node_modules/ 2>/dev/null
ln -s $FROG/.babelrc . 2>/dev/null
$YARN install

# install activities and operators packages
for dir in $FROG/ac/ac-*/ $FROG/op/op-*/
do
    cd $dir
    mkdir -p node_modules
    ln -s $FROG/node_modules/* node_modules/ 2>/dev/null
    ln -s $FROG/frog-utils node_modules/ 2>/dev/null
    ln -s $FROG/.babelrc . 2>/dev/null
    $YARN install
    npm run build &
done

# links all packages to the frog/ meteor project
cd $FROG/frog
mkdir -p node_modules
ln -s $FROG/node_modules/* node_modules/ 2>/dev/null
ln -s $FROG/frog-utils node_modules/ 2>/dev/null
ln -s $FROG/.babelrc . 2>/dev/null

for dir in `ls $FROG/ac |grep 'ac'` 
do
    ln -s $FROG/ac/$dir node_modules/ 2>/dev/null
done

for dir in `ls $FROG/op |grep 'op'`
do
    ln -s $FROG/op/$dir node_modules/ 2>/dev/null
done

IFS=$SAVEIFS
