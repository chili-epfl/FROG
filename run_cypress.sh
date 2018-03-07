#!/bin/bash

shopt -s dotglob

CYPRESS_VERSION='2.0.1'
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

"$CYPRESS" run --record --key e92a866f-0cde-45be-9cd8-72f9ed6650f3
exit 0
