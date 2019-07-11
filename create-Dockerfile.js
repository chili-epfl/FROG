const template = `FROM node:12.6
RUN apt-get update && apt-get install -y ocaml libelf-dev
RUN curl -sL https://install.meteor.com | sed s/--progress-bar/-sL/g | /bin/sh

RUN mkdir -p /usr/src/frog/frog && chmod a+rwx -R /usr/src/frog
WORKDIR /usr/src/frog
RUN mkdir -p ./flow-typed
COPY flow-typed flow-typed/
RUN mkdir -p frog/.meteor frog/server && \\
  echo "import './shutdown-if-env.js';" > frog/server/main.js
COPY frog/imports/startup/shutdown-if-env.js frog/server
COPY frog/.meteor/packages frog/.meteor/versions frog/.meteor/release frog/.meteor/
ENV LANG='C.UTF-8' LC_ALL='C.UTF-8'
RUN cd /usr/src/frog/frog && METEOR_SHUTDOWN=true /usr/local/bin/meteor --once --allow-superuser; exit 0
RUN mkdir -p __mocks__ 

COPY package.json yarn.lock .yarnrc ./
COPY yarn.lock yarn.lock.orig
COPY __mocks__ ./__mocks__
COPY *.sh linkFiles.js package-scripts.js ./
COPY frog/package.json frog/babel.config.js frog/
WORKDIR /usr/src/frog
RUN /usr/src/frog/initial_setup.sh 

COPY frog /usr/src/frog/frog/
COPY *.js .*ignore *config ./
RUN rm -rf ./frog/node_modules
RUN /usr/src/frog/initial_setup.sh

EXPOSE 3000
CMD [ "npm", "start", "test.ci" ]
`;

// eslint-disable-next-line
console.log(template);
