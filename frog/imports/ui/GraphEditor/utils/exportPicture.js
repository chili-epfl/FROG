// @flow
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import { saveSvgAsPng } from 'save-svg-as-png';

import { store } from '../store';
import { timeToPx } from '../utils';
import Graph from '../Graph';

export default () => {
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
