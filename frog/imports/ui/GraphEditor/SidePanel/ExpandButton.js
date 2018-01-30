// @flow
import React from 'react';
import Switch from 'material-ui/Switch';
import Tooltip from 'material-ui/Tooltip';
import { connect } from '../store';

export default connect(
  ({ store: { ui: { setSidepanelOpen, sidepanelOpen } } }) => {
    if (sidepanelOpen) {
      return null;
    }
    return (
      <Tooltip id="tooltip-top" title="show the activity menu" placement="top">
        <Switch
          checked={sidepanelOpen}
          onChange={() => setSidepanelOpen(true)}
          aria-label="showSidePanel"
        />
      </Tooltip>
    );
  }
);
