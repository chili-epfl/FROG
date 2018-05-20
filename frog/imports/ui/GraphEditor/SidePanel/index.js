// @flow
import * as React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Button } from 'react-bootstrap';

import { connect } from '../store';
import ActivityPanel from './ActivityPanel';
import OperatorPanel from './OperatorPanel';

const styles = {
  root: {
    height: 'calc(100vh - 64px - 48px)',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    width: '500px'
  },
  helperContainer: {
    height: '100%'
  }
};

const SideBarHelperText = ({ classes }) => (
  <Grid
    container
    justify="center"
    alignItems="center"
    className={classes.helperContainer}
  >
    <div>
      <Typography variant="title" align="center" gutterBottom>
        Select an activity or an operator to configure it.
      </Typography>
      <Typography variant="subheading" align="center">
        Press the <kbd>w</kbd> key to toggle the sidebar.
      </Typography>
    </div>
  </Grid>
);

export const IconButton = ({ icon, onClick, tooltip }: Object) => (
  <div className="bootstrap">
    <Button
      style={{ width: '35px', height: '25px' }}
      data-tip={tooltip}
      onClick={onClick}
    >
      <span className={icon} style={{ verticalAlign: 'top' }} />
    </Button>
  </div>
);

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
