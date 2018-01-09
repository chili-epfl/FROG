#!/bin/bash

shopt -s dotglob

FROG="`pwd`"
CYPRESS_VERSION='1.4.1'
if which cypress && [[ `cypress --version` =~ $CYPRESS_VERSION ]]; then 
    echo 'Using pre-installed global Cypress'; CYPRESS=cypress
else
    if [ -f "$FROG/node_modules/.bin/cypress" ] && [[ `"$FROG/node_modules/.bin/cypress" --version` =~ $CYPRESS_VERSION ]]; then 
        echo 'Using pre-installed local Cypress'; CYPRESS="$FROG/node_modules/.bin/cypress"
    else
        echo 'Installing Cypress'; npm install cypress@$CYPRESS_VERSION && CYPRESS="$FROG/node_modules/.bin/cypress"
    fi
fi
echo "Cypress: $CYPRESS"

cd frog;meteor & 
../node_modules/.bin/wait-on http://localhost:3000
cd ..
"$CYPRESS" run
exit 0
