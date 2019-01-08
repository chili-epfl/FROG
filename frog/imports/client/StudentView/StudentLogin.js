// @flow
import * as React from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router';
import { isEmpty } from 'lodash';
import { TextInput } from 'frog-utils';
import { AppBar, Toolbar, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const splitList = (liststr: string) => {
  const list = (liststr || '').split('\n');
  return list;
};

const styles = () => ({
  container: {
    width: '100%',
    overflow: 'auto',
    marginLeft: 10
  },
  toolbar: {
    minHeight: 48,
    height: 48
  },
  mainContent: {
    width: '100%',
    marginTop: 48
  },
  mustLogin: { marginTop: '15px' },
  loginButton: { marginLeft: 10 },
  studentNameButton: {
    minWidth: 250,
    margin: 5
  }
});

type SettingsT = {
  loginByName: boolean,
  secret?: boolean,
  secretString?: string,
  specifyName: boolean,
  studentlist?: string
};

type StudentLoginPropsT = {
  login: Function,
  settings: SettingsT,
  classes: Object
};

class StudentLogin extends React.Component<
  StudentLoginPropsT,
  {
    selected: string | null,
    secret?: string,
    name?: string
  }
> {
  constructor(props: StudentLoginPropsT) {
    super(props);
    this.state = { selected: null };
  }

  login = () => {
    const settings = this.props.settings;
    if (
      settings.secret &&
      settings.secretString &&
      !isEmpty(settings.secretString)
    ) {
      if (
        !this.state.secret ||
        settings.secretString.trim().toUpperCase() !==
          (this.state.secret && this.state.secret.trim().toUpperCase())
      ) {
        // eslint-disable-next-line no-alert
        return window.alert('Secret token is not correct');
      }
    }
    this.props.login({
      username:
        this.state.selected || (this.state.name && this.state.name.trim()),
      isStudentList: true
    });
  };

  render() {
    const { settings, classes } = this.props;
    return (
      <>
        <AppBar>
          <Toolbar className={classes.toolbar} />
        </AppBar>
        <div className={classes.mainContent}>
          {!settings ||
          settings.loginByName === false ||
          (!settings.specifyName && isEmpty(settings.studentlist)) ? (
            <h2 className={classes.mustLogin}>
              Must log in to access this session
            </h2>
          ) : (
            <>
              {settings.studentlist && (
                <div className={classes.container}>
                  <h2>Select your name below</h2>
                  {splitList(settings.studentlist).map(studentName => {
                    const isSelected = this.state.selected === studentName;
                    return (
                      <Button
                        key={studentName}
                        className={classes.studentNameButton}
                        variant="contained"
                        color={isSelected ? 'primary' : 'default'}
                        onClick={() => {
                          if (isSelected) {
                            this.setState({ selected: null });
                          } else {
                            this.setState({ selected: studentName });
                          }
                        }}
                      >
                        {studentName}
                      </Button>
                    );
                  })}
                </div>
              )}
              {settings.specifyName && (
                <div className={classes.container}>
                  <h2>Log in as new user:</h2>
                  {this.state.selected ? (
                    <p>
                      Cancel the selection above, to be able to specify a new
                      name
                    </p>
                  ) : (
                    <>
                      <b>Enter your name to login as a new user</b>
                      <br />
                      <TextInput
                        focus={false}
                        onChange={e => this.setState({ name: e })}
                      />
                      <p />
                    </>
                  )}
                </div>
              )}
              {settings.secret && !isEmpty(settings.secretString) && (
                <div className={classes.container}>
                  <h2>Secret token:</h2>
                  <b>Please enter the token that your teacher gave you:</b>
                  <br />
                  <TextInput
                    focus={false}
                    onChange={e => this.setState({ secret: e })}
                  />
                  <p />
                </div>
              )}
              <Button
                onClick={this.login}
                className={classes.loginButton}
                disabled={
                  (!this.state.selected && isEmpty(this.state.name)) ||
                  ((settings.studentlist && settings.studentlist) || '')
                    .split('\n')
                    .map(x => x.toUpperCase())
                    .includes(
                      this.state.name && this.state.name.trim().toUpperCase()
                    )
                }
              >
                Log in
              </Button>
            </>
          )}
        </div>
      </>
    );
  }
}

export default compose(
  withStyles(styles),
  withRouter
)(StudentLogin);
