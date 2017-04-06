FROM node:7.8.0-alpine
RUN groupadd -r meteor && useradd -r -g meteor meteor
USER meteor
RUN curl -sL https://install.meteor.com | sed s/--progress-bar/-sL/g | /bin/sh

RUN mkdir -p /usr/src/frog/frog
WORKDIR /usr/src/frog
RUN prepare_docker.sh
COPY .docker /usr/src/frog

RUN cd /usr/src/frog && ./initial_setup.sh
RUN mkdir -p frog/frog/.meteor
COPY frog/frog/.meteor/packages frog/frog/.meteor/versions frog/frog/.meteor/
RUN cd /usr/src/frog/frog && METEOR_SHUTDOWN=true meteor --once


CMD [ "npm", "test" ]
