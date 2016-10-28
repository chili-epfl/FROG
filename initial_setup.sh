#!/bin/bash
cd op-random
npm install
npm link
cd ../op-arguegraph
npm install
npm link
cd ../FROG
npm link op-random
npm link op-arguegraph
