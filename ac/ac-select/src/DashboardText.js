import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withState } from 'recompose';
import Highlighter from './Highlighter';
import ColorSelect from './ColorSelect';

const styles = () => ({
  table: {
    minWidth: 700
  },
  head: {
    fontSize: 'large'
  }
});

const ViewerStyleless = ({
  state,
  activity,
  currentColor,
  setCurrentColor
}) => {
  const selectPenColor = color => setCurrentColor(color);
  const searchWords =
    currentColor === '#FFFFFF'
      ? Object.keys(state).reduce((acc, cur) => {
          const tmp = { ...acc };
          tmp[cur] = { color: '#FFFF00', vote: state[cur].colors.length };
          return tmp;
        }, {})
      : Object.keys(state)
          .filter(x => state[x].colors.includes(currentColor))
          .reduce((acc, cur) => {
            const tmp = { ...acc };
            tmp[cur] = {
              color: currentColor,
              vote: state[cur].colors.filter(x => x === currentColor).length
            };
            return tmp;
          }, {});
  return (
    <div
      style={{
        height: '100%',
        overflow: 'scroll',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <ColorSelect
        {...{ selectPenColor }}
        data={{ currentColor }}
        disableNone={false}
      />
      <Highlighter
        {...{ searchWords }}
        textToHighlight={activity.data ? activity.data.title || '' : ''}
        highlightStyle={{
          backgroundColor: currentColor,
          fontSize: 'xx-large'
        }}
        unhighlightStyle={{ fontSize: 'xx-large' }}
      />
      {activity.data.text &&
        activity.data.text
          .split('\n')
          .filter(x => x !== '')
          .map(sub => (
            <p key={sub}>
              <Highlighter
                {...{ searchWords }}
                highlightStyle={{
                  backgroundColor: currentColor
                }}
                textToHighlight={activity.data ? activity.data.text || '' : ''}
              />
            </p>
          ))}
    </div>
  );
};

const reactiveToDisplay = (reactive: any) => {
  const state = {};
  Object.keys(reactive)
    .map(x => reactive[x]['highlighted'])
    .forEach(highlighted => {
      Object.keys(highlighted).forEach(word => {
        if (state[word])
          state[word] = {
            colors: [...state[word].colors, highlighted[word].color]
          };
        else
          state[word] = {
            colors: [highlighted[word].color]
          };
      });
    });
  return state;
};

const initData = {};

const dashboardText = {
  Viewer: withStyles(styles)(
    withState('currentColor', 'setCurrentColor', '#FFFFFF')(ViewerStyleless)
  ),
  reactiveToDisplay,
  initData
};

export default dashboardText;
