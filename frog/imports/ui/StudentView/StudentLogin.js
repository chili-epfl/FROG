// @flow
import * as React from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router';
import { isEmpty } from 'lodash';
import { TextInput } from 'frog-utils';
import {
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  Button,
  Grid
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const splitList = (liststr: string) => {
  const list = (liststr || '').split('\n');
  const extra = list.length % 2 ? 1 : 0;
  const length = list.length / 2;
  return [list.slice(0, length + extra), list.slice(length + extra)];
};

const styles = () => ({
  root: {
    width: '100%',
    overflow: 'auto',
    marginLeft: '10px'
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
  listItem: { minWidth: '300px' }
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
  classes: Object,
  history: Object,
  slug: string
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
    const { settings, classes, history, slug } = this.props;
    return (
      <>
        <div className={classes.root}>
          <AppBar>
            <Toolbar className={classes.toolbar} />
          </AppBar>
        </div>
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
                <div className={classes.root}>
                  <h2>Select your name below</h2>
                  <Grid container spacing={24}>
                    {splitList(settings.studentlist).map(lst => (
                      <Grid key={lst[0] || 'key'}>
                        <List>
                          {lst.map(x => (
                            <ListItem
                              className={classes.listItem}
                              selected={this.state.selected === x}
                              disabled={
                                this.state.selected && this.state.selected !== x
                              }
                              key={x}
                              button
                              onClick={() => {
                                if (this.state.selected === x) {
                                  this.setState({ selected: null });
                                } else {
                                  this.setState({ selected: x });
                                }
                              }}
                            >
                              <ListItemText primary={x} />
                            </ListItem>
                          ))}
                        </List>
                      </Grid>
                    ))}
                  </Grid>
                </div>
              )}
              {settings.specifyName && (
                <>
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
                </>
              )}
              {settings.secret &&
                !isEmpty(settings.secretString) && (
                  <>
                    <h2>Secret token:</h2>
                    <b>Please enter the token that your teacher gave you:</b>
                    <br />
                    <TextInput
                      focus={false}
                      onChange={e => this.setState({ secret: e })}
                    />
                    <p />
                  </>
                )}
              <Button
                style={{ marginLeft: '10px' }}
                onClick={this.login}
                className="btn btn-success"
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
