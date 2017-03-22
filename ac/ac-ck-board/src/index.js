import React from 'react';
import Board from './board';

export const meta = {
  name: 'Common Knowledge board',
  type: 'react-component',
  mode: 'collab'
};

export const config = {
  type: 'object',
  properties: {
    duration: {
      type: 'number',
      title: 'Duration in seconds (0 for infinity)'
    }
  }
};

export const BoardWrapper = props => (
  <div>
    <div className="col-md-4"><Board {...props} /> </div>
  </div>
);

export default {
  id: 'ac-ck-board',
  meta,
  config,
  ActivityRunner: BoardWrapper,
  Dashboard: null
};
