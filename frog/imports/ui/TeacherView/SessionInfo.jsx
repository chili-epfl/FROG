import * as React from 'react';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import { withState } from 'recompose';
import Tooltip from 'material-ui/Tooltip';
import Button from 'material-ui/Button';
import Group from 'material-ui-icons/Group';
import Roster from './Roster';
import styles from './styles';

const SessionInfo = withState('open', 'setModalState', false)(props => {
  const {
    classes,
    students,
    sessionStatus,
    session,
    setModalState,
    open
  } = props;

  const handleClick = () => setModalState(!open);
  console.log(open);

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
            Session Graph ({sessionStatus})
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
            onClick={handleClick}
          >
            Roster
            <Group className={classes.rightIcon} />
          </Button>
        </Tooltip>
        <Roster
          students={students}
          open={open}
          onClose={handleClick}
          session={session}
          {...props}
        />
      </Grid>
    </Grid>
  );
});

export default withStyles(styles)(SessionInfo);
