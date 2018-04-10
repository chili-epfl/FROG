// @flow
import * as React from 'react';
import styled from 'styled-components';

import { connect } from '../store';
import ActivityPanel from './ActivityPanel';
import OperatorPanel from './OperatorPanel';

export default connect(
  ({
    setDelete,
    setIdRemove,
    importActivityList,
    setImportActivityList,
    lastRefreshAct,
    refreshActDate,
    store: { ui: { selected, sidepanelOpen } }
  }) => {
    if (!sidepanelOpen) {
      return null;
    }
    if (selected && selected.klass === 'activity') {
      return (
        <SidebarContainer>
          <ActivityPanel
            {...{
              setDelete,
              setIdRemove,
              importActivityList,
              setImportActivityList,
              lastRefreshAct,
              refreshActDate
            }}
            id={selected.id}
          />
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
  <div className="bootstrap">
    <SidebarContainerDiv>{children}</SidebarContainerDiv>
  </div>
));

const SidebarContainerDiv = styled.div`
  padding: 0px;
  x: 300px;
  width: 497px;
  height: 760px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
`;
