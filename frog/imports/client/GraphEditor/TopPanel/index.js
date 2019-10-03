// @flow

import React from 'react';
import { withStyles } from '@material-ui/styles';
import { UndoButton, ConfigMenu } from './Settings';
import { ValidButton, ErrorList } from '/imports/client/GraphEditor/Validator';
import { Button } from '/imports/ui/Button';
import { addSession, setTeacherSession, Sessions } from '/imports/api/sessions';
import { Graphs, renameGraph } from '/imports/api/graphs';

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
  },
  rename: {
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '6px'
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

const RenameBox = withStyles(styles)(({ classes, graphId }) => {
  return (
    <input
      className={classes.rename}
      type="text"
      defaultValue={Graphs.findOne(graphId).name || 'none'}
      onChange={e => renameGraph(graphId, e.target.value)}
    />
  );
});

const TopPanel = ({ classes, graphId, errors, history, ...props }: Object) => (
  <div className={classes.root}>
    <RenameBox graphId={graphId} />
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
