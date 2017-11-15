// @flow
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import { saveSvgAsPng, svgAsPngUri } from 'save-svg-as-png';

import { store } from '../store';
import { timeToPx } from '../utils';
import Graph from '../Graph';

export default (dataCB: string => void) => {
  const canvas = document.createElement('canvas');

  const oldScale = store.ui.scale;
  store.ui.setIsSvg(true);
  store.ui.setScaleValue(store.graphDuration / 30);
  store.ui.setGraphWidth(1768);
  render(
    <Provider store={store}>
      <Graph viewBox={[0, 0, 1, 1].join(' ')} isSvg scaled hasTimescale />
    </Provider>,
    canvas
  );
  const pictureWidth = timeToPx(store.graphDuration, store.graphDuration / 30);
  if (dataCB) {
    svgAsPngUri(
      store.ui.svgRef,
      {
        width: pictureWidth,
        height: 600
      },
      dataCB
    );
  } else {
    saveSvgAsPng(store.ui.svgRef, 'graph.png', {
      width: pictureWidth,
      height: 600
    });
  }
  store.ui.setIsSvg(false);
  store.ui.setScaleValue(oldScale);
  store.ui.updateGraphWidth();
};
