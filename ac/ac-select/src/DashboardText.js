// @flow

import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { type DashboardT, type LogDbT } from 'frog-utils';
import Highlighter from './Highlighter';

const styles = () => ({
  table: {
    minWidth: 700
  },
  head: {
    fontSize: 'large'
  }
});

const VoteToColor = (votes) => {

}

const ViewerStyleless = ({ state, activity }) => (
  <>
  <Highlighter
    searchWords={Object.keys(state).map(x => ({word: x, votes: state[x]}))}
    textToHighlight={
      activity.data ? activity.data.title || '' : ''
    }
    highlightStyle={{
      backgroundColor: 'yellow',
      fontSize: 'xx-large'
    }}
    colorFun={() => VoteToColor()}
    unhighlightStyle={{ fontSize: 'xx-large'}}
    multicolor='dash'
  />
  <Highlighter
    searchWords={Object.keys(state)}
    highlightStyle={{ backgroundColor: 'yellow'}}
    textToHighlight={
      activity.data ? activity.data.text || '' : ''
    }
    colorFun={VoteToColor}
    multicolor='dash'
  />
</>
);

const mergeLog = (state: any, log: LogDbT) => {
  switch (log.type) {
    case 'plus':
      state[log.value] = state[log.value] ? (state[log.value] += 1) : 1;
      break;
    case 'minus':
      state[log.value] -= 1;
      break;
    default:
  }
};

const initData = {};

const dashboardText: DashboardT = {
  Viewer: withStyles(styles)(ViewerStyleless),
  mergeLog,
  initData
};

export default dashboardText
