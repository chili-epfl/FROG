// @flow
import * as React from 'react';

import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import { connect } from '../store';
import ActivityPanel from './ActivityPanel';
import OperatorPanel from './OperatorPanel';

const styles = {
  root: {
    backgroundColor: '#ffffff',
    padding: '5px 5px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
  }
};

const SidebarContainer = connect(({ children, classes }) => (
  <Grid item xs={5} className={classes.root}>
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
          <Typography variant="title" gutterBottom component="p">
            Select an activity or an operator to configure it.
          </Typography>
          <Typography gutterBottom component="p">
            Press the <kbd>w</kbd> key toggle the sidebar.
          </Typography>
        </StyledSideBarContainer>
      );
    }
  }
);
