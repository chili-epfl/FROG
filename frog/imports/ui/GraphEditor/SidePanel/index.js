import React from 'react';
import styled from 'styled-components';

import { connect } from '../store';
import ActivityPanel from './ActivityPanel';
import OperatorPanel from './OperatorPanel';

export default connect(({ store: { ui: { selected } } }) => {
  if (selected && selected.klass === 'activity') {
    return (
      <SidebarContainer><ActivityPanel id={selected.id} /></SidebarContainer>
    );
  } else if (selected && selected.klass === 'operator') {
    return (
      <SidebarContainer><OperatorPanel id={selected.id} /></SidebarContainer>
    );
  } else {
    return null;
  }
});

const SidebarContainer = styled.div`
  padding: 0px;
  flex: 0 auto;
  width: 500px;
  background-color: #ffffff;
  overflow: scroll;
`;
