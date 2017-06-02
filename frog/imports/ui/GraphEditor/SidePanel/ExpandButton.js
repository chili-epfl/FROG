// @flow
import styled from 'styled-components';
import React from 'react';

import { connect } from '../store';

export default connect(
  ({ store: { ui: { setSidepanelOpen, sidepanelOpen } } }) => {
    if (sidepanelOpen) {
      return null;
    }
    return (
      <CloseA onClick={() => setSidepanelOpen(true)}>
        <i className="fa fa-ellipsis-v" />
      </CloseA>
    );
  }
);

const CloseA = styled.a`
  position: fixed;
  right: 30px;
  top: 100px;
  font-size: 2em;
`;
