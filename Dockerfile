FROM node:7.8.0
RUN apt-get update && apt-get install -y ocaml libelf-dev
RUN curl -sL https://install.meteor.com | sed s/--progress-bar/-sL/g | /bin/sh
RUN npm install -g babel-cli flow-copy-source

RUN mkdir -p /usr/src/frog/frog && chmod a+rwx -R /usr/src/frog
WORKDIR /usr/src/frog
RUN mkdir -p frog \

frog-utils/src \
ac/ac-brainstorm/src \
ac/ac-chat/src \
ac/ac-ck-board/src \
ac/ac-form/src \
ac/ac-iframe/src \
ac/ac-quiz/src \
ac/ac-text/src \
ac/ac-video/src \
op/op-aggregate-ck-board/src \
op/op-aggregate-text/src \
op/op-argue/src \
op/op-jigsaw/src \
op/op-like-with-like/src
COPY package.json yarn.lock ./
COPY *.sh ./
COPY frog-utils/package.json frog-utils/yarn.lock frog-utils/
COPY ac/ac-brainstorm/package.json ac/ac-brainstorm/yarn.lock ac/ac-brainstorm/
COPY ac/ac-chat/package.json ac/ac-chat/yarn.lock ac/ac-chat/
COPY ac/ac-ck-board/package.json ac/ac-ck-board/yarn.lock ac/ac-ck-board/
COPY ac/ac-form/package.json ac/ac-form/yarn.lock ac/ac-form/
COPY ac/ac-iframe/package.json ac/ac-iframe/yarn.lock ac/ac-iframe/
COPY ac/ac-quiz/package.json ac/ac-quiz/yarn.lock ac/ac-quiz/
COPY ac/ac-text/package.json ac/ac-text/yarn.lock ac/ac-text/
COPY ac/ac-video/package.json ac/ac-video/yarn.lock ac/ac-video/
COPY op/op-aggregate-ck-board/package.json op/op-aggregate-ck-board/yarn.lock op/op-aggregate-ck-board/
COPY op/op-aggregate-text/package.json op/op-aggregate-text/yarn.lock op/op-aggregate-text/
COPY op/op-argue/package.json op/op-argue/yarn.lock op/op-argue/
COPY op/op-jigsaw/package.json op/op-jigsaw/yarn.lock op/op-jigsaw/
COPY op/op-like-with-like/package.json op/op-like-with-like/yarn.lock op/op-like-with-like/

RUN sh /usr/src/frog/initial_docker.sh

COPY frog/package.json frog/
RUN cd /usr/src/frog/frog && /usr/local/bin/meteor npm install --allow-superuser
RUN mkdir -p frog/.meteor frog/server && \
  echo "import './shutdown-if-env.js';" > frog/server/main.js
COPY frog/imports/startup/shutdown-if-env.js frog/server
COPY frog/.meteor/packages frog/.meteor/versions frog/.meteor/release frog/.meteor/
ENV LANG='C.UTF-8' LC_ALL='C.UTF-8'
RUN cd /usr/src/frog/frog && METEOR_SHUTDOWN=true /usr/local/bin/meteor --once --allow-superuser

COPY ac /usr/src/frog/ac/
COPY op /usr/src/frog/op/
COPY frog-utils /usr/src/frog/frog-utils/
RUN sh /usr/src/frog/initial_docker.sh
COPY frog frog/
RUN mkdir -p ./flow-typed
COPY flow-typed flow-typed/
COPY *.js .*ignore *config package-scripts.js ./

EXPOSE 3000
CMD [ "npm", "test" ]
