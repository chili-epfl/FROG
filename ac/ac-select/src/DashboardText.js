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

const VoteToColor = (vote, maxVote) =>
  'rgb(' +
  (Number(maxVote) > 4 ? 255 - (vote - 4) * 10 : 255) +
  ',' +
  (Number(maxVote) > 4 ? 255 - (vote - 4) * 10 : 255) +
  ',' +
  (220 - (vote / Number(maxVote)) * 180) +
  ')';

const ViewerStyleless = ({ state, activity }) => {
  const searchWords = Object.keys(state).map(x => ({
    word: x,
    color: VoteToColor(
      state[x],
      Object.values(state).reduce(
        (acc, cur) => (Number(cur) > Number(acc) ? cur : acc),
        0
      )
    ),
    vote: state[x]
  }));
  return (
    <div
      style={{
        height: '100%',
        overflow: 'scroll',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Highlighter
        searchWords={searchWords}
        textToHighlight={activity.data ? activity.data.title || '' : ''}
        highlightStyle={{
          fontSize: 'xx-large'
        }}
        unhighlightStyle={{ fontSize: 'xx-large' }}
      />
      <Highlighter
        searchWords={searchWords}
        textToHighlight={activity.data ? activity.data.text || '' : ''}
      />
    </div>
  );
};

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

export default dashboardText;
