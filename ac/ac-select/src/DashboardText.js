import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withState, compose } from 'recompose';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

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
  setCurrentColor,
  mode,
  setMode,
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
          <Button
            variant="contained"
            color="primary"
            onClick={() => setMode('text')}
            style={{ width: '200px' }}
          >
            See text
          </Button>
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
                      {word[0]}
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
          <Button
            variant="contained"
            color="primary"
            onClick={() => setMode('ranking')}
            style={{ width: '200px' }}
          >
            See word ranking
          </Button>

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
          {activity.data.text &&
            activity.data.text.split('\n\n').map((sub, i) => {
              const k = sub + i;
              return (
                <p key={k}>
                  {sub.split('\n').map((sub2, index) => {
                    const k2 = sub2 + index;
                    return (
                      <Highlighter
                        key={k2}
                        {...{ searchWords }}
                        highlightStyle={{
                          backgroundColor: currentColor
                        }}
                        textToHighlight={sub2}
                      />
                    );
                  })}
                </p>
              );
            })}
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

const initData = {};

const dashboardText = {
  Viewer: withStyles(styles)(
    compose(
      withState('mode', 'setMode', 'ranking'),
      withState('currentColor', 'setCurrentColor', '#FFFFFF')
    )(ViewerStyleless)
  ),
  reactiveToDisplay,
  initData
};

export default dashboardText;
