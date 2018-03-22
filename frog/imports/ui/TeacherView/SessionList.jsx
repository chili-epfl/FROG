import React from 'react';
import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Typography from 'material-ui/Typography';
import Tooltip from 'material-ui/Tooltip';
import IconButton from 'material-ui/IconButton';
import Grid from 'material-ui/Grid';
import Add from 'material-ui-icons/Add';
import CompareArrows from 'material-ui-icons/CompareArrows';
import Card, { CardContent } from 'material-ui/Card';

import { addSession, setTeacherSession } from '../../api/sessions';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 0,
    margin: 0,
    display: 'flex'
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 250
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    width: 35
  },
  title: {
    marginBottom: 16,
    fontSize: 14
  }
});

@withStyles(styles)
export class SessionAdmin extends React.Component<
  { sessions: Array<Object>, graphs: Array<Object>, classes: Object },
  { graphId: string, sessionId: string }
> {
  state = {
    graphId: '',
    sessionId: ''
  };

  handleGraphChange = (event: Event) => {
    if (event.target.value !== undefined && event.target.value !== '') {
      this.setState({ graphId: String(event.target.value) });
    }
  };

  handleSessionCreation = () => {
    if (this.state.graphId !== undefined && this.state.graphId !== '') {
      addSession(this.state.graphId);
    }
  };

  handleSessionChange = (event: Event) => {
    if (event.target.value !== undefined && event.target.value !== '') {
      this.setState({ sessionId: String(event.target.value) });
    }
  };

  handleSelectSession = () => {
    if (this.state.sessionId !== undefined && this.state.sessionId !== '') {
      setTeacherSession(this.state.sessionId);
    }
  };

  render() {
    const { sessions, graphs, classes } = this.props;
    return (
      <div className={classes.root}>
        <form autoComplete="off" className={classes.root}>
          <Grid container styles={classes.root} justify="center" spacing={8}>
            {graphs && graphs.length ? (
              <Grid item>
                <div className={classes.root}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="create-session">Graph</InputLabel>
                    <Select
                      native
                      value={this.state.graphId}
                      onChange={this.handleGraphChange}
                      input={<Input id="create-session" />}
                    >
                      <option value="" />
                      {graphs.length ? (
                        graphs.filter(x => !x.sessionId).map(graph => (
                          <option
                            key={graph._id}
                            data-key={graph._id}
                            value={graph._id}
                          >
                            {graph.name}
                          </option>
                        ))
                      ) : (
                        <option>No graph</option>
                      )}
                    </Select>
                    <FormHelperText>
                      Select a graph to create a new session
                    </FormHelperText>
                  </FormControl>
                  <div className={classes.basic}>
                    <Tooltip id="tooltip-top" title="create a new session">
                      <IconButton
                        className={classes.button}
                        color="primary"
                        aria-label="create"
                        onClick={this.handleSessionCreation}
                      >
                        <Add />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </Grid>
            ) : (
              <Grid item>
                <Typography type="body1" gutterBottom>
                  There are no <i>valid</i> graphs available.
                </Typography>
              </Grid>
            )}
            {sessions && sessions.length ? (
              <Grid item>
                <div className={classes.root}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="select-session">Session</InputLabel>
                    <Select
                      native
                      value={this.state.sessionId}
                      onChange={this.handleSessionChange}
                      input={<Input id="select-session" />}
                    >
                      <option value="" />
                      {sessions.length ? (
                        sessions.map(session => (
                          <option key={session._id} value={session._id}>
                            {session.name} ({session.slug})
                          </option>
                        ))
                      ) : (
                        <option>No Session</option>
                      )}
                    </Select>
                    <FormHelperText>Switch to selected session</FormHelperText>
                  </FormControl>
                  <div className={classes.basic}>
                    <Tooltip id="tooltip-top" title="switch session">
                      <IconButton
                        className={classes.button}
                        color="primary"
                        aria-label="create"
                        onClick={this.handleSelectSession}
                      >
                        <CompareArrows />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </Grid>
            ) : (
              <Grid item>
                <Typography type="body1" gutterBottom>
                  Create a new session
                </Typography>
              </Grid>
            )}
          </Grid>
        </form>
      </div>
    );
  }
}

const SessionList = ({
  graphs,
  sessions,
  ...props
}: {
  graphs: Array<Object>,
  sessions: Array<Object>,
  classes: Object
}) => {
  const { classes } = props;
  return (
    <div>
      <Grid id="graph-session" item xs={12}>
        <Card>
          <CardContent>
            <Typography type="title" className={classes.title}>
              Session Controls
            </Typography>
            <SessionAdmin sessions={sessions} graphs={graphs} {...props} />
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
};

export default withStyles(styles)(SessionList);
