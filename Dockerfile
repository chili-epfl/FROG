FROM node:7.8.0
RUN apt-get update && apt-get install -y ocaml libelf-dev 
RUN curl -sL https://install.meteor.com | sed s/--progress-bar/-sL/g | /bin/sh
RUN npm install -g babel-cli flow-copy-source

RUN mkdir -p /usr/src/frog/frog && chmod a+rwx -R /usr/src/frog 
WORKDIR /usr/src/frog
RUN mkdir -p frog \
frog-utils \
ac/ac-ck-board \
ac/ac-form \
ac/ac-iframe \
ac/ac-jigsaw \
ac/ac-quiz \
ac/ac-text \
ac/ac-video \
op/aggregate-ck-board \
op/aggregate-text \
op/argue \
op/jigsaw \
op/like-with-like 
COPY package.json ./
COPY *.sh ./
COPY frog-utils/package.json frog-utils/
COPY ac/ac-ck-board/package.json ac/ac-ck-board/
COPY ac/ac-form/package.json ac/ac-form/
COPY ac/ac-iframe/package.json ac/ac-iframe/
COPY ac/ac-jigsaw/package.json ac/ac-jigsaw/
COPY ac/ac-quiz/package.json ac/ac-quiz/
COPY ac/ac-text/package.json ac/ac-text/
COPY ac/ac-video/package.json ac/ac-video/
COPY op/op-aggregate-ck-board/package.json op/op-aggregate-ck-board/
COPY op/op-aggregate-text/package.json op/op-aggregate-text/
COPY op/op-argue/package.json op/op-argue/
COPY op/op-jigsaw/package.json op/op-jigsaw/
COPY op/op-like-with-like/package.json op/op-like-with-like/

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
COPY .* ./
COPY ./flow-typed ./
WORKDIR /usr/src/frog
EXPOSE 3000
CMD [ "npm" , "test" ]
