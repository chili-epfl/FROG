FROM cypress/base:10
COPY package.json .
RUN npm install
COPY ./ .
CMD ./node_modules/.bin/cypress run --spec  cypress/integration/scale.js  --record --key e92a866f-0cde-45be-9cd8-72f9ed6650f3

