import * as React from 'react';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import { withState, compose } from 'recompose';
import Tooltip from 'material-ui/Tooltip';
import Button from 'material-ui/Button';
import Group from 'material-ui-icons/Group';
import Roster from './Roster';
import styles from './styles';

const SessionInfoController = ({ classes, session, open, setModalState }) => {
  const sessionState =
    session && session.state ? session.state.toLowerCase() : 'stopped';

  return (
    <Grid
      container
      spacing={24}
      alignItems="center"
      direction="row"
      justify="space-between"
    >
      <Grid item>
        <div className={classes.statusTitle}>
          <Typography type="title" className={classes.title}>
            Session Graph ({sessionState})
          </Typography>
        </div>
      </Grid>
      <Grid item>
        <Tooltip
          id="tooltip-top"
          title="edit the roster list for this session"
          placement="top"
        >
          <Button
            size="small"
            color="primary"
            className={classes.button}
            onClick={() => setModalState(true)}
          >
            Roster
            <Group className={classes.rightIcon} />
          </Button>
        </Tooltip>
        <Roster
          open={open}
          onClose={() => setModalState(false)}
          session={session}
        />
      </Grid>
    </Grid>
  );
};

const SessionInfo = compose(
  withStyles(styles),
  withState('open', 'setModalState', false)
)(SessionInfoController);

export default SessionInfo;
