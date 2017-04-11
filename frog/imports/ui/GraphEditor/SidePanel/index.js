// @flow
import React from 'react';
import styled from 'styled-components';

import { connect } from '../store';
import ActivityPanel from './ActivityPanel';
import OperatorPanel from './OperatorPanel';

export default connect(({ store: { ui: { selected, sidepanelOpen } } }) => {
  if (!sidepanelOpen) {
    return null;
  }
  if (selected && selected.klass === 'activity') {
    return (
      <SidebarContainer><ActivityPanel id={selected.id} /></SidebarContainer>
    );
  } else if (selected && selected.klass === 'operator') {
    return (
      <SidebarContainer><OperatorPanel id={selected.id} /></SidebarContainer>
    );
  } else {
    return (
      <SidebarContainer>
        Select an activity or an operator to configure it. Press the
        {' '}
        <b>w</b>
        {' '}
        key, or the hide button to hide the sidebar.
      </SidebarContainer>
    );
  }
});
const SidebarContainer = connect(({
  store: { ui: { setSidepanelOpen } },
  children
}) => (
  <SidebarContainerDiv>
    <CloseButtonA onClick={() => setSidepanelOpen(false)}>
      <i className="fa fa-times" />
    </CloseButtonA>
    {children}
  </SidebarContainerDiv>
));

const SidebarContainerDiv = styled.div`
  padding: 0px;
  flex: 0 auto;
  width: 500px;
  background-color: #ffffff;
  overflow: scroll;
`;

const CloseButtonA = styled.a`
  float: right;
  font-size: 2em;
`;
