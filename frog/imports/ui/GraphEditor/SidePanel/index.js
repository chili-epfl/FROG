// @flow
import * as React from 'react';
import styled from 'styled-components';
import Grid from 'material-ui/Grid';

import { connect } from '../store';
import ActivityPanel from './ActivityPanel';
import OperatorPanel from './OperatorPanel';

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
        <SidebarContainer>
          <ActivityPanel {...rest} id={selected.id} />
        </SidebarContainer>
      );
    } else if (selected && selected.klass === 'operator') {
      return (
        <SidebarContainer>
          <OperatorPanel id={selected.id} />
        </SidebarContainer>
      );
    } else {
      return (
        <SidebarContainer>
          Select an activity or an operator to configure it. Press the <b>w</b>{' '}
          key, or the hide button to hide the sidebar.
        </SidebarContainer>
      );
    }
  }
);

const SidebarContainer = connect(({ children }) => (
  <Grid item xs={5}>
    <div className="bootstrap">
      <SidebarContainerDiv>{children}</SidebarContainerDiv>
    </div>
  </Grid>
));

const SidebarContainerDiv = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
`;
