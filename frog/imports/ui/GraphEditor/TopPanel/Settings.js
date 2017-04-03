import React from 'react';
import { connect } from '../store';
import { exportGraph } from '../utils/export';

export default connect(({
  store: { overlapAllowed, updateSettings, undo, canUndo, history }
}) => (
  <div className="topPanelUnit">
    <input
      type="checkbox"
      id="cbox"
      checked={overlapAllowed}
      onChange={e => {
        updateSettings({ overlapAllowed: e.target.checked });
      }}
    />
    <label htmlFor="cbox">Overlap allowed</label>
    {canUndo &&
      <a href="#" onClick={undo} style={{ marginLeft: '50px' }}>
        Undo ({history.length})
      </a>}
    <a
      href="#"
      onClick={() => console.log(exportGraph())}
      style={{ marginLeft: '50px' }}
    >
      Export graph
    </a>
  </div>
));
