// @flow
/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory';

import { HTML } from 'frog-utils';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#bbb',
    height: '100%',
    width: '100%',
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
  }
});

const TextQ = withStyles(styles)(({ question, answers, classes }) => (
  <Paper className={classes.question}>
    <Typography align="center" variant="button" gutterBottom>
      <HTML html={question} />
    </Typography>
    <ul>
      {answers.map((x, i) => (
        <li key={i}>{x}</li>
      ))}
    </ul>
  </Paper>
));

const Question = withStyles(styles)(({ question, answers, classes }) => (
  <Paper className={classes.question}>
    <div className={classes.header}>
      <b>Question:</b>
      <HTML html={question} />
    </div>
    {answers
      .map((a, idx) => (
        <HTML
          key={a.x || idx}
          html={'<b>Choice ' + (answers.length - idx) + ' :</b>' + a.x}
        />
      ))
      .reverse()}
    <VictoryChart
      height={150}
      theme={VictoryTheme.material}
      padding={{ top: 0, left: 75, right: 10, bottom: 30 }}
      domainPadding={20}
    >
      <VictoryBar
        horizontal
        domain={{ x: [0, Math.max(5, ...answers.map(ans => ans.y))] }}
        data={answers.map((a, idx) => ({
          y: a.y,
          x: 'Choice ' + (answers.length - idx)
        }))}
      />
    </VictoryChart>
  </Paper>
));

const Viewer = withStyles(styles)(
  ({ state, classes }: { state: Object, classes: Object }) => (
    <div className={classes.root}>
      {state.result.map(([k, v, idx]) => (
        <Question key={idx} question={k} answers={v} />
      ))}
      {state.questionTexts.filter(k => !!k).map((k, idx) => (
        <TextQ key={idx} question={state.questions[idx].question} answers={k} />
      ))}
    </div>
  )
);

export default Viewer;
