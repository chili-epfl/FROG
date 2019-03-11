#!/bin/bash

set -e

METEOR_VERSION=$(head $APP_SOURCE_DIR/.meteor/release | cut -d "@" -f 2)
printf "\n[-] Installing the  Meteor version = $METEOR_VERSION ...\n\n"

# This will install user's HOME directory called .meteor and executable is in .meteor/meteor
curl -v https://install.meteor.com/ | sh

# create symlink to bin, $HOME/bin is in the PATH
mkdir $HOME/bin
ln -s $HOME/.meteor/meteor $HOME/bin/meteor

# printf "symlink result \n $(ls $HOME/bin)"
echo "$(which $HOME/.meteor/meteor)"