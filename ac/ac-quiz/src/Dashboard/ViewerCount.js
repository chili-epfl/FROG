// @flow
/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import {
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryAxis,
  VictoryTheme
} from 'victory';
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
    overflow: 'auto',
    padding: '4px'
  },
  question: {
    width: '100%',
    padding: '4px',
    marginBottom: '8px'
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
    <Typography align="center" variant="button" gutterBottom>
      <HTML html={question} />
    </Typography>
    <VictoryChart
      height={150}
      theme={VictoryTheme.material}
      style={{
        tickLabels: { fontSize: 10 }
      }}
      padding={{ top: 0, left: 200, right: 10, bottom: 30 }}
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
        data={answers}
        style={{
          data: {
            fillOpacity: 1,
            strokeWidth: 1
          }
        }}
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
      {state.questionTexts.map((k, idx) => (
        <TextQ key={idx} question={state.questions[idx].question} answers={k} />
      ))}
    </div>
  )
);

export default Viewer;
