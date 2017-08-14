const fs = require('fs');

fs.readdir('./ac', (_, ac) => {
  fs.readdir('./op', (__, op) => {
    const acop = [...ac.map(x => 'ac/' + x), ...op.map(x => 'op/' + x)];
    const acopSrc = acop.map(dir => dir + '/src').join(' \\\n');
    const acopCP = acop
      .map(dir => `COPY ${dir}/package.json ${dir}/yarn.lock ${dir}/`)
      .join('\n');
    const template = `FROM node:7.8.0
RUN apt-get update && apt-get install -y ocaml libelf-dev
RUN curl -sL https://install.meteor.com | sed s/--progress-bar/-sL/g | /bin/sh
RUN npm install -g babel-cli flow-copy-source

RUN mkdir -p /usr/src/frog/frog && chmod a+rwx -R /usr/src/frog
WORKDIR /usr/src/frog
RUN mkdir -p frog \\
frog-utils/src \\
${acopSrc}

COPY package.json yarn.lock .yarnrc .babelrc ./
COPY *.sh ./
COPY frog-utils/package.json frog-utils/yarn.lock frog-utils/
${acopCP}
COPY initial_setup_wo_meteor.sh /usr/src/frog/

RUN sh /usr/src/frog/initial_setup_wo_meteor.sh

COPY frog/package.json frog/
RUN cd /usr/src/frog/frog && /usr/local/bin/meteor npm install -g yarn --allow-superuser && /usr/local/bin/meteor yarn install --ignore-engines
RUN mkdir -p frog/.meteor frog/server && \\
  echo "import './shutdown-if-env.js';" > frog/server/main.js
COPY frog/imports/startup/shutdown-if-env.js frog/server
COPY frog/.meteor/packages frog/.meteor/versions frog/.meteor/release frog/.meteor/
ENV LANG='C.UTF-8' LC_ALL='C.UTF-8'
RUN cd /usr/src/frog/frog && METEOR_SHUTDOWN=true /usr/local/bin/meteor --once --allow-superuser

COPY ac /usr/src/frog/ac/
COPY op /usr/src/frog/op/
COPY frog-utils /usr/src/frog/frog-utils/
RUN sh /usr/src/frog/initial_setup_wo_meteor.sh
COPY frog frog/
RUN mkdir -p ./flow-typed
COPY flow-typed flow-typed/
COPY *.js .*ignore *config package-scripts.js ./

EXPOSE 3000
CMD [ "npm", "test" ]
`;

    // eslint-disable-next-line
    console.log(template);
  });
});
