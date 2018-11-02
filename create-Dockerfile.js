const fs = require('fs');

fs.readdir('./ac', (_, ac) => {
  fs.readdir('./op', (__, op) => {
    const acop = [...ac.map(x => 'ac/' + x), ...op.map(x => 'op/' + x)];
    const acopSrc = acop.map(dir => dir + '/src').join(' \\\n');
    const acopCP = acop
      .map(dir => `COPY ${dir}/package.json ${dir}/`)
      .join('\n');
    const template = `FROM node:10.6
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
RUN mkdir -p __mocks__ frog-utils/src \\
${acopSrc}

COPY package.json yarn.lock .yarnrc babel.config.js ./
COPY package-lock.json package-lock.json.orig
COPY yarn.lock yarn.lock.orig
COPY __mocks__ ./__mocks__
COPY *.sh linkFiles.js package-scripts.js ./
COPY frog-utils/package.json frog-utils/
${acopCP}
COPY frog/package.json frog/
WORKDIR /usr/src/frog
RUN /usr/src/frog/initial_setup.sh 

COPY ac /usr/src/frog/ac/
COPY op /usr/src/frog/op/
COPY frog-utils /usr/src/frog/frog-utils/
COPY frog /usr/src/frog/frog/
COPY *.js .*ignore *config ./
RUN /usr/src/frog/initial_setup.sh --single

EXPOSE 3000
CMD [ "npm", "start", "test.ci" ]
`;

    // eslint-disable-next-line
    console.log(template);
  });
});
