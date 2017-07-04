# FROG
Fabricating and running orchestration graphs. To learn more about the design and architecture, visit our [wiki](https://github.com/chili-epfl/FROG/wiki).

## Set up

- install [Meteor](https://www.meteor.com/install)

- run the commands
    * `./initial_setup.sh` (if problem occur with bcrypt you can try to run `meteor npm install --python=python2.7` from the `frog/` directory)
    * go to the `frog/` directory and run `meteor`

- Go to http://localhost:3000/ on your browser

## Licensing
The main FROG program (in the frog/ directory) is licensed under the [GNU Affero General Public License 3.0](https://www.gnu.org/licenses/agpl-3.0.en.html) (or, at your option, a later version). The licenses of all other packages may be found in their respective directories (LICENSE files in each sub-directory). While the main application is AGPL, we generally license more broadly applicable libraries, as well as specific learning activities, under permissive licenses such as the [ISC license](https://www.isc.org/downloads/software-support-policy/isc-license/) to facilitate their reuse in other systems. Please [Contact us](mailto:shaklev@gmail.com) if you have any questions about licensing.

## Development

- Learn Meteor framework with React:
https://www.meteor.com/tutorials/react/creating-an-app

- Run ./run_and_watch_all.sh to automatically have packages rebuilt after editing them (otherwise your changes will not be picked up by Meteor)
- Note that we use `yarn` extensively. You should only use `yarn` to install packages in all other directories than in the main `./frog` application. In `./frog`, you should use `meteor npm install`. If you see lot's of error messages about missing dependencies etc, commit your changes to Git, and run `git reset --hard; git clean -fdx; ./initial_setup.sh` from the root directory again. (This will remove any changes not committed to Git!)

- You can use the URL shorthand `<host>/#/{view}/{user}` to automatically open a given component with a given user (which will be automatically created if it does not yet exist). For example, `http://localhost:3000/#/student/peter`, will open the student view logged in as peter.
- However, if you open a number of windows in the same browser, they will all be logged in as the latest user, because of cookies. A way around this is to add entries like this in /etc/hosts:

   ```bash
   127.0.0.1	localhost
   127.0.0.1	dev1
   127.0.0.1	dev2
   127.0.0.1	dev3
   ```

Reload `/etc/hosts` (on [OSX](https://superuser.com/questions/346518/how-do-i-refresh-the-hosts-file-on-os-x)), and then log in to different users on different "domains". 


## Code style/testing

- We use [prettier](https://github.com/prettier/prettier) for Javascript formatting, all pull-requests must be formatted accordingly.
- We use ESLint for testing syntax.
- We use Jest for tests.
