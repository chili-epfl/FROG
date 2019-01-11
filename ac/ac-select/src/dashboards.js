import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withState, compose } from 'recompose';
import { memoize } from 'lodash';

import Highlighter from './Highlighter';
import ColorSelect from './ColorSelect';

const styles = () => ({
  table: {
    minWidth: 700
  },
  head: {
    fontSize: 'large'
  },
  text: {
    height: '100%',
    overflow: 'scroll',
    display: 'flex',
    flexDirection: 'column',
    margin: '20px',
    fontSize: '1.5em',
    lineHeight: '150%',
    fontFamily: 'serif',
    whiteSpace: 'pre-wrap'
  }
});

const lookupCapitalization = (word, text) => {
  if (text.includes(word)) {
    return word;
  } else return text.match(new RegExp(word, 'gi'))[0];
};

const lookupCapitalizationMemo = memoize(lookupCapitalization, x => [
  x.word,
  x.activityId
]);

const ViewerStyleless = ({
  state,
  activity,
  currentColor,
  setCurrentColor,
  mode,
  classes
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
      {activity.data?.chooseColor && (
        <ColorSelect
          {...{ selectPenColor }}
          data={{ currentColor }}
          disableNone={false}
        />
      )}
      {mode === 'ranking' ? (
        <>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.head}>Word</TableCell>
                <TableCell className={classes.head}>N° of highlights</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(searchWords)
                .map(x => [x, searchWords[x].vote])
                .sort((y, z) => z[1] - y[1])
                .map(word => (
                  <TableRow key={word[0]}>
                    <TableCell>
                      {lookupCapitalizationMemo(
                        word[0],
                        activity.data.text,
                        activity._id
                      )}
                      <div />
                    </TableCell>
                    <TableCell>{word[1]}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </>
      ) : (
        <>
          <div className={classes.text}>
            <Highlighter
              {...{ searchWords }}
              textToHighlight={activity.data ? activity.data.title || '' : ''}
              highlightStyle={{
                backgroundColor: currentColor,
                fontSize: 'xx-large'
              }}
              unhighlightStyle={{ fontSize: 'xx-large' }}
            />
            <br />
            {activity.data.text && (
              <Highlighter
                {...{ searchWords }}
                highlightStyle={{
                  backgroundColor: currentColor
                }}
                textToHighlight={activity.data.text}
              />
            )}
          </div>
        </>
      )}
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

const Viewer = compose(
  withStyles(styles),
  withState('currentColor', 'setCurrentColor', '#FFFFFF')
)(ViewerStyleless);

const initData = {};

export default {
  wordRank: {
    reactiveToDisplay,
    initData,
    Viewer: props => <Viewer mode="ranking" {...props} />
  },
  text: {
    reactiveToDisplay,
    initData,
    Viewer
  }
};
