FROM meteorhacks/meteord:devbuild

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# install possible development utilities, uncomment according to requirements
#RUN npm install --silent -g gulp-cli
#RUN npm install --silent -g grunt-cli

COPY . /usr/src/app/

RUN cd /usr/src/app && ./initial_setup.sh
RUN cd /usr/src/app/frog && METEOR_SHUTDOWN=true meteor --allow-superuser --once

CMD [ "npm", "test" ]
