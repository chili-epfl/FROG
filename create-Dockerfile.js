const fs = require('fs');

fs.readdir('./ac', (_, ac) => {
  fs.readdir('./op', (__, op) => {
    const acop = [...ac.map(x => 'ac/' + x), ...op.map(x => 'op/' + x)];
    const acopSrc = acop.map(dir => dir + '/src').join(' \\\n');
    const acopCP = acop
      .map(dir => `COPY ${dir}/package.json ${dir}/`)
      .join('\n');
    const template = `FROM cypress/base:8
RUN apt-get update && apt-get install -y ocaml libelf-dev
RUN npm install -g yarn@1.3.2 
RUN curl -sL https://install.meteor.com | sed s/--progress-bar/-sL/g | /bin/sh

RUN mkdir -p /usr/src/frog/frog && chmod a+rwx -R /usr/src/frog
WORKDIR /usr/src/frog

RUN npm install cypress@1.4.1
RUN mkdir -p frog/.meteor frog/server && \\
  echo "import './shutdown-if-env.js';" > frog/server/main.js
COPY frog/imports/startup/shutdown-if-env.js frog/server
COPY frog/.meteor/packages frog/.meteor/versions frog/.meteor/release frog/.meteor/
ENV LANG='C.UTF-8' LC_ALL='C.UTF-8'
RUN cd /usr/src/frog/frog && METEOR_SHUTDOWN=true /usr/local/bin/meteor --once --allow-superuser; exit 0
RUN mkdir -p frog-utils/src \\
${acopSrc}
COPY initial_setup_wo_meteor.sh /usr/src/frog/

COPY package.json yarn.lock .yarnrc .babelrc cypress.json cypress ./
COPY *.sh ./
COPY frog-utils/package.json frog-utils/
${acopCP}
COPY frog/package.json frog/
WORKDIR /usr/src/frog
RUN /usr/src/frog/initial_setup_wo_meteor.sh

COPY ac /usr/src/frog/ac/
COPY op /usr/src/frog/op/
COPY frog-utils /usr/src/frog/frog-utils/
COPY frog /usr/src/frog/frog/
RUN /usr/src/frog/initial_setup_wo_meteor.sh
RUN mkdir -p ./flow-typed
COPY flow-typed flow-typed/
COPY *.js .*ignore *config package-scripts.js cypress.json cypress ./

EXPOSE 3000
CMD [ "npm", "test" ]
`;

    // eslint-disable-next-line
    console.log(template);
  });
});
