import React from 'react';
import { saveSvgAsPng } from 'save-svg-as-png';

import { connect, store } from '../store';

const download = e => {
  e.preventDefault();
  saveSvgAsPng(store.ui.svgRef, 'graph.png', {
    scale: 4,
    width: store.ui.graphWidth * 4
  });
};

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
    &nbsp;
    <a href onClick={download}>Download as PNG</a>
  </div>
));
