import React from 'react';
import { render } from 'react-dom';
import { saveSvgAsPng } from 'save-svg-as-png';

import { Provider } from 'mobx-react';
import { connect, store } from '../store';
import Graph from '../Graph';

const download = e => {
  e.preventDefault();
  const canvas = document.createElement('canvas');
  render(
    <Provider store={store}>
      <Graph
        width={store.graphDuration}
        isSvg
        height={600}
        viewBox={[0, 0, store.graphDuration, 600].join(' ')}
      />
    </Provider>,
    canvas
  );

  saveSvgAsPng(store.ui.svgRef, 'graph.png', {
    width: 100 / 3 * store.graphDuration,
    height: 600
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
