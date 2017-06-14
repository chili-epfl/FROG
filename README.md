# FROG
Fabricating and running orchestration graphs. To learn more about the design and architecture, visit our [wiki](https://github.com/chili-epfl/FROG/wiki).

## Set up

- install [Meteor](https://www.meteor.com/install)

- run the commands
    * `./initial_setup.sh` (if problem occur with bcrypt you can try to run `meteor npm install --python=python2.7` from the `frog/` directory)
    * go to the `frog/` directory and run `meteor`

- Go to http://localhost:3000/ on your browser

## Development

- Learn Meteor framework with React:
https://www.meteor.com/tutorials/react/creating-an-app

- Run ./run_and_watch_all.sh to automatically have packages rebuilt after editing them (otherwise your changes will not be picked up by Meteor)

## Code style/testing

- We use [prettier](https://github.com/prettier/prettier) for Javascript formatting, all pull-requests must be formatted accordingly.
- We use ESLint for testing syntax.
- We use Jest for tests.
