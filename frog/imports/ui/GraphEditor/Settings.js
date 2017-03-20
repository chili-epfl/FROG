import React from 'react';
import { connect } from './store';

export default connect(({
  store: { updateSettings, undo, canUndo, history }
}) => (
  <span>
    <input
      type="checkbox"
      id="cbox"
      onChange={e => {
        updateSettings({ overlapAllowed: e.target.checked });
      }}
    />
    <label htmlFor="cbox">Overlap allowed</label>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    <a href="#" onClick={undo}>
      Undo ({history.length})
    </a>
  </span>
));
