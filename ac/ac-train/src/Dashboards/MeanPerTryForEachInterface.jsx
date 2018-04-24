// @flow
import * as React from 'react';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';

import { VictoryChart, VictoryLine, VictoryLegend } from 'victory';

import { color } from './utils';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3
  })
});

const MeanPerTryForEachInterface = props => {
  const { whichDash, state, activity } = props;
  const iterations = Number(activity.data.iterationPerInterface);

  const count = state['count'];
  const dash = state[whichDash];

  const interfaces = Object.keys(dash);

  if (interfaces.length > 0) {
    const allCoordinates = interfaces.map(int => {
      const coordinates = [];

      for (let i = 0; i < iterations; i += 1) {
        if (Number.isFinite(dash[int][i] / count[int][i])) {
          coordinates.push({
            x: i + 1,
            y: dash[int][i] / count[int][i],
            fill: color(int)
          });
        }
      }
      return {
        name: int,
        coordinates
      };
    });

    const legend = allCoordinates.map(int => ({
      name: int.name,
      symbol: { fill: color(int.name) }
    }));

    const domain =
      whichDash === 'error'
        ? { x: [1, iterations], y: [0, 1] }
        : { x: [1, iterations] };

    return (
      <Paper className={props.classes.root} elevation={4}>
        <Grid container>
          <Grid item xs={12}>
            <Typography align="center" variant="button" gutterBottom>
              Mean {whichDash} Per Ticket For Each Interface
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <VictoryChart domainPadding={{ y: [0, 5] }}>
              <VictoryLegend
                x={50}
                y={0}
                orientation="horizontal"
                gutter={20}
                style={{ border: { stroke: 'black' }, title: { fontSize: 20 } }}
                data={legend}
              />
              {allCoordinates.map(int => (
                <VictoryLine
                  key={int.name}
                  domain={domain}
                  style={{
                    data: { stroke: color(int.name) },
                    parent: { border: '1px solid #ccc' }
                  }}
                  data={int.coordinates}
                />
              ))}
            </VictoryChart>
          </Grid>
        </Grid>
      </Paper>
    );
  } else {
    return (
      <Paper className={props.classes.root} elevation={4}>
        <Grid container>
          <Grid item xs={12}>
            <Typography align="center" variant="button" gutterBottom>
              Waiting for data
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    );
  }
};

export default withStyles(styles)(MeanPerTryForEachInterface);
