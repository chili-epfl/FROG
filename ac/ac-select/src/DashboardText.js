// @flow

import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Highlighter from './Highlighter';

const styles = () => ({
  table: {
    minWidth: 700
  },
  head: {
    fontSize: 'large'
  }
});

// const VoteToColor = (vote, maxVote) =>
//   ({backgroundColor: '#FFFF00', filter: 'brightness('+Math.floor((maxVote-vote)/maxVote*100)+'%)'});

const ViewerStyleless = ({ state, activity }) => (
  // console.log(state)
  // const searchWords = Object.keys(state).map(x => ({
  //   word: x,
  //   style: VoteToColor(
  //     state[x],
  //     Object.values(state).reduce(
  //       (acc, cur) => (Number(cur) > Number(acc) ? cur : acc),
  //       0
  //     )
  //   ),
  //   vote: state[x]
  // }));
  <div
    style={{
      height: '100%',
      overflow: 'scroll',
      display: 'flex',
      flexDirection: 'column'
    }}
  >
    <Highlighter
      searchWords={state}
      textToHighlight={activity.data ? activity.data.title || '' : ''}
      highlightStyle={{
        fontSize: 'xx-large'
      }}
      unhighlightStyle={{ fontSize: 'xx-large' }}
    />
    <Highlighter
      searchWords={state}
      textToHighlight={activity.data ? activity.data.text || '' : ''}
    />
  </div>
);

const reactiveToDisplay = (reactive: any) => {
  const state = {};
  // if(activity.data.multi){
  Object.keys(reactive)
    .map(x => reactive[x]['highlighted'])
    .forEach(highlighted => {
      Object.keys(highlighted).forEach(word => {
        if (state[word])
          state[word] = {
            style: {
              ...state[word].style,
              filter: 'brightness(' + (100 - state[word].vote * 10) + '%)'
            },
            vote: state[word].vote + 1
          };
        else
          state[word] = {
            style: { backgroundColor: '#FFFF00', filter: 'brightness(100%)' },
            vote: 1
          };
      });
    });
  // }else{
  //   Object.values(reactive).map(x => x.highlighted)
  //   .forEach(highlighted => {
  //     Object.keys(highlighted).forEach(word => {
  //       if(state[word])
  //         state[word].push(highlighted[word])
  //       else
  //         state[word] = highlighted[word]
  //     })
  //   })
  // }
  return state;
};

const initData = {};

const dashboardText = {
  Viewer: withStyles(styles)(ViewerStyleless),
  reactiveToDisplay,
  initData
};

export default dashboardText;
