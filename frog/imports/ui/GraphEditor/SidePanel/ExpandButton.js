import React from 'react';
import styled from 'styled-components';

import { connect } from '../store';

export default connect(({
  store: { ui: { setSidepanelOpen, sidepanelOpen } }
}) => {
  if (sidepanelOpen) {
    return null;
  }
  return (
    <CloseDiv>
      <i className="fa fa-ellipsis-v" onClick={() => setSidepanelOpen(true)} />
    </CloseDiv>
  );
});

const CloseDiv = styled.div`
  position: fixed;
  right: 30px;
  top: 100px;
  font-size: 2em;
`;
