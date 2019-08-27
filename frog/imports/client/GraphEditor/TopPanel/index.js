// @flow

import React from 'react';
import { withStyles } from '@material-ui/styles';
import { UndoButton, ConfigMenu } from './Settings';
import { ValidButton, ErrorList } from '/imports/client/GraphEditor/Validator';
import { Button } from '/imports/ui/Button';
import { addSession, setTeacherSession, Sessions } from '/imports/api/sessions';
import { Graphs } from '/imports/api/graphs';

const styles = theme => ({
  root: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    padding: theme.spacing(0.5)
  },
  errors: {
    position: 'absolute',
    top: 'calc(100% + 5px)',
    right: '0',
    pointerEvents: 'none',
    zIndex: '1000'
  }
});

const publish = async (graphId, history) => {
  const sessionId = await addSession(graphId);
  const session = Sessions.findOne(sessionId);
  if (session) {
    Graphs.update(graphId, { $set: { published: true } });
    await setTeacherSession(sessionId);
    history.push('/t/' + session.slug);
  }
};

const TopPanel = ({ classes, graphId, errors, history, ...props }: Object) => (
  <div className={classes.root}>
    <UndoButton />
    <Button
      onClick={() => {
        // don't publish if there are errors
        if (errors.length === 0) {
          publish(graphId, history);
        }
      }}
      rightIcon={<ValidButton />}
      disabledHover="true"
    >
      Publish
    </Button>
    <ConfigMenu {...props} />
    <div className={classes.errors}>
      <ErrorList offset="true" />
    </div>
  </div>
);

export default withStyles(styles)(TopPanel);
