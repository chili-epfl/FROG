// @flow
/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLabel
} from 'victory';
import { isEmpty } from 'lodash';

import { HTML } from '/imports/frog-utils';

import { Paper, List, ListItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#bbb',
    height: '100%',
    width: '100%',
    maxWidth: '900px',
    overflow: 'auto',
    padding: '4px'
  },
  question: {
    width: '100%',
    flex: '0 0 auto',
    padding: '8px',
    marginBottom: '8px',
    overflow: 'auto'
  },
  header: {
    backgroundColor: '#ddd',
    borderBottom: '2px solid black',
    padding: '4px',
    marginBottom: '4px'
  },
  justifications: { fontSize: '20px' }
});

const Question = withStyles(styles)(({ texts, question, answers, classes }) => {
  const separateAnswers = !answers.every(
    ans => ans.x?.length < 20 && !ans.x.includes('$')
  );
  return (
    <Paper className={classes.question}>
      <div className={classes.header}>
        <b>Question:</b>
        <HTML html={question} />
      </div>
      {separateAnswers &&
        answers
          .map((a, idx) => (
            <HTML
              key={a.x || idx}
              html={'<b>Choice ' + (answers.length - idx) + ' :</b>' + a.x}
            />
          ))
          .reverse()}
      {!isEmpty(answers) && (
        <VictoryChart
          height={150}
          theme={VictoryTheme.material}
          padding={{ top: 0, left: 75, right: 10, bottom: 30 }}
          domainPadding={20}
        >
          <VictoryAxis
            style={{ tickLabels: { fontSize: 7 } }}
            tickLabelComponent={<VictoryLabel />}
          />
          <VictoryAxis
            dependentAxis
            style={{ tickLabels: { fontSize: 7 } }}
            tickLabelComponent={<VictoryLabel />}
          />
          <VictoryBar
            horizontal
            domain={{ x: [0, Math.max(5, ...answers.map(ans => ans.y))] }}
            data={answers.map((a, idx) => ({
              y: a.y,
              x: separateAnswers ? 'Choice ' + (answers.length - idx) : a.x
            }))}
          />
        </VictoryChart>
      )}
      {!isEmpty(texts) && (
        <div>
          <List>
            {texts.map((x, i) => (
              <ListItem className={classes.justifications} divider key={i}>
                {x}
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </Paper>
  );
});

const Viewer = withStyles(styles)(
  ({ state, classes }: {state: Object, classes: Object}) => (
    <div className={classes.root}>
      {state.result.map(([k, v, idx]) => (
        <Question
          key={idx}
          question={k}
          answers={v}
          texts={state.questionTexts[idx]}
        />
      ))}
    </div>
  )
);

export default Viewer;
