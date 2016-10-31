#!/bin/bash
cd ac-iframe
npm install
npm link
cd op-random
npm install
npm link
cd ../op-arguegraph
npm install
npm link
cd ../ac-video
npm install
npm link
cd ../FROG
npm link op-random
npm link op-arguegraph
npm link ac-video
npm link ac-iframe
