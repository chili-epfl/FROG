// @flow
import React from 'react';
import Switch from 'material-ui/Switch';

import { connect } from '../store';

export default connect(
  ({ store: { ui: { setSidepanelOpen, sidepanelOpen } } }) => {
    if (sidepanelOpen) {
      return null;
    }
    return (
      <Switch
        checked={sidepanelOpen}
        onChange={() => setSidepanelOpen(true)}
        aria-label="showSidePanel"
      />
    );
  }
);
