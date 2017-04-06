import { render } from 'react-dom';
import React from 'react';
import { saveSvgAsPng } from 'save-svg-as-png';

import { Provider } from 'mobx-react';
import { connect, store } from '../store';
import { timeToPx } from '../utils';
import Graph from '../Graph';

const download = e => {
  e.preventDefault();
  const canvas = document.createElement('canvas');

  const oldScale = store.ui.scale;
  store.ui.setScaleValue(store.graphDuration / 30);
  store.ui.setGraphWidth(1768);
  render(
    <Provider store={store}>
      <Graph viewBox={[0, 0, 1, 1].join(' ')} isSvg scaled hasTimescale />
    </Provider>,
    canvas
  );
  const pictureWidth = timeToPx(store.graphDuration, store.graphDuration / 30);
  saveSvgAsPng(store.ui.svgRef, 'graph.png', {
    width: pictureWidth,
    height: 600
  });
  store.ui.setScaleValue(oldScale);
  store.ui.updateGraphWidth();
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
