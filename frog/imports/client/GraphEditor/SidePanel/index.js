// @flow
import * as React from 'react';

import { withStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Button } from 'react-bootstrap';

import { makeStyles } from '@material-ui/core/styles';
import { connect } from '../store';
import ActivityPanel from './ActivityPanel';
import OperatorPanel from './OperatorPanel';

const styles = {
  root: {
    height: 'calc(100vh - 50px - 300px)',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #EAEAEA',
    width: '400px',
    overflowX: 'auto'
  },
  helperContainer: {
    height: '100%'
  }
};

const useStyles = makeStyles({
  button: {
    width: '40px',
    height: '30px',
    border: '1px solid #EEE',
    margin: '1px',
    boxShadow: 'none'
  },
  spanIcon: { position: 'static', verticalAlign: 'top' }
});

const SideBarHelperText = ({ classes }) => (
  <Grid
    container
    justify="center"
    alignItems="center"
    className={classes.helperContainer}
  >
    <div>
      <Typography variant="h6" align="center" gutterBottom>
        Select an activity or an operator to configure it.
      </Typography>
      {/* <Typography variant="subtitle1" align="center">
        Press the <kbd>w</kbd> key to toggle the sidebar.
      </Typography> */}
    </div>
  </Grid>
);

export const IconButton = ({ icon, onClick, tooltip }: Object) => {
  const classes = useStyles();
  return (
    <div className="bootstrap">
      <Button className={classes.button} data-tip={tooltip} onClick={onClick}>
        <span className={`${icon} ${classes.spanIcon}`} />
      </Button>
    </div>
  );
};

const StyledSideBarHelperText = withStyles(styles)(SideBarHelperText);

const SidebarContainer = connect(({ children, classes }) => (
  <Grid item className={classes.root}>
    {children}
  </Grid>
));

const StyledSideBarContainer = withStyles(styles)(SidebarContainer);

export default connect(
  ({
    store: {
      ui: { selected, sidepanelOpen }
    },
    ...rest
  }) => {
    if (!sidepanelOpen) {
      return null;
    }
    if (selected && selected.klass === 'activity') {
      return (
        <StyledSideBarContainer>
          <ActivityPanel {...rest} id={selected.id} />
        </StyledSideBarContainer>
      );
    } else if (selected && selected.klass === 'operator') {
      return (
        <StyledSideBarContainer>
          <OperatorPanel id={selected.id} />
        </StyledSideBarContainer>
      );
    } else {
      return (
        <StyledSideBarContainer>
          <StyledSideBarHelperText />
        </StyledSideBarContainer>
      );
    }
  }
);
