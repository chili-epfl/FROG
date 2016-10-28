#!/bin/bash
cd op-random
npm install
npm link
cd ../FROG
npm link op-random
