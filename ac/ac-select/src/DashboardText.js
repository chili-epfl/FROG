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

const testState = {
  dyin: { colors: ['#FFFF00'] },
  'people ': { colors: ['#FFFF00'] },
  irate: {
    colors: [
      '#FFFF00',
      '#FFFF00',
      '#FFFF00',
      '#FFFF00',
      '#FFFF00',
      '#FFFF00',
      '#FFFF00',
      '#FFFF00',
      '#FFFF00'
    ]
  },
  haterade: { colors: ['#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00'] },
  questioning: { colors: ['#FFFF00'] },
  preachin: {
    colors: [
      '#FFFF00',
      '#FFFF00',
      '#FFFF00',
      '#FFFF00',
      '#FFFF00',
      '#FFFF00',
      '#FFFF00',
      '#FFFF00',
      '#FFFF00',
      '#FFFF00',
      '#FFFF00',
      '#FFFF00',
      '#FFFF00'
    ]
  },
  momma: { colors: ['#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00'] },
  discriminate: {
    colors: ['#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00']
  },
  meditate: {
    colors: ['#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00']
  },
  animosity: {
    colors: [
      '#FFFF00',
      '#FFFF00',
      '#FFFF00',
      '#FFFF00',
      '#FFFF00',
      '#FFFF00',
      '#FFFF00'
    ]
  },
  'weed ': { colors: ['#FFFF00'] },
  around: { colors: ['#FFFF00'] },
  hurtin: { colors: ['#FFFF00', '#FFFF00'] },
  'hell ': { colors: ['#FFFF00', '#FFFF00'] },
  'guidance ': {
    colors: [
      '#FFFF00',
      '#FFFF00',
      '#FFFF00',
      '#FFFF00',
      '#FFFF00',
      '#FFFF00',
      '#FFFF00'
    ]
  },
  overseas: { colors: ['#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00'] },
  'bullets ': { colors: ['#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00'] },
  em: { colors: ['#FFFF00', '#FFFF00'] },
  'bound ': { colors: ['#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00'] },
  'ongoing ': { colors: ['#FFFF00', '#FFFF00', '#FFFF00'] },
  murdered: { colors: ['#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00'] },
  'truth ': { colors: ['#FFFF00'] },
  'election ': { colors: ['#FFFF00'] },
  sellin: { colors: ['#FFFF00', '#FFFF00'] },
  'breathe ': { colors: ['#FFFF00'] },
  layin: { colors: ['#FFFF00'] },
  'selfishness ': { colors: ['#FFFF00', '#FFFF00', '#FFFF00'] },
  equality: { colors: ['#FFFF00', '#FFFF00', '#FFFF00'] },
  'suffering ': {
    colors: ['#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00']
  },
  'cheek ': { colors: ['#FFFF00', '#FFFF00'] },
  "ain't ": { colors: ['#FFFF00', '#FFFF00'] },
  'distracted ': {
    colors: ['#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00']
  },
  'concept ': { colors: ['#FFFF00', '#FFFF00'] },
  karma: { colors: ['#FFFF00'] },
  gravitate: { colors: ['#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00'] },
  'peas ': { colors: ['#FFFF00', '#FFFF00'] },
  racist: { colors: ['#FFFF00'] },
  'the ': { colors: ['#FFFF00'] },
  'get ': { colors: ['#FFFF00', '#FFFF00'] },
  'help ': { colors: ['#FFFF00'] },
  along: { colors: ['#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00'] },
  above: { colors: ['#FFFF00'] },
  'instead ': { colors: ['#FFFF00'] },
  'generates ': { colors: ['#FFFF00', '#FFFF00', '#FFFF00', '#FFFF00'] },
  'madness ': { colors: ['#FFFF00', '#FFFF00', '#FFFF00'] },
  operates: { colors: ['#FFFF00', '#FFFF00', '#FFFF00'] },
  'protests ': { colors: ['#FFFF00'] },
  'chase ': { colors: ['#FFFF00'] },
  choke: { colors: ['#FFFF00', '#FFFF00'] },
  'spreading ': { colors: ['#FFFF00'] },
  'you ': { colors: ['#FFFF00'] },
  'what ': { colors: ['#FFFF00'] },
  'discriminate ': { colors: ['#FFFF00'] },
  'practice ': { colors: ['#FFFF00', '#FFFF00', '#FFFF00'] },
  mommas: { colors: ['#FFFF00'] },
  straight: { colors: ['#FFFF00'] },
  'vote ': { colors: ['#FFFF00'] },
  'attracted ': { colors: ['#FFFF00', '#FFFF00'] },
  'streets ': { colors: ['#FFFF00', '#FFFF00'] },
  demonstrate: { colors: ['#FFFF00', '#FFFF00'] },
  insane: { colors: ['#FFFF00', '#FFFF00'] },
  'set ': { colors: ['#FFFF00'] },
  droppin: { colors: ['#FFFF00', '#FFFF00'] },
  killin: { colors: ['#FFFF00'] },
  us: { colors: ['#FFFF00'] },
  'tell ': { colors: ['#FFFF00'] },
  'celebrate ': { colors: ['#FFFF00'] },
  'nation ': { colors: ['#FFFF00'] },
  'youth ': { colors: ['#FFFF00'] },
  bacteria: { colors: ['#FFFF00'] },
  'lack ': { colors: ['#FFFF00', '#FFFF00'] },
  gosh: { colors: ['#FFFF00'] },
  unity: { colors: ['#FFFF00'] }
};

const ViewerStyleless = ({
  activity,
  currentColor,
  setCurrentColor,
  mode,
  setMode,
  classes
}) => {
  const state = testState;
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
