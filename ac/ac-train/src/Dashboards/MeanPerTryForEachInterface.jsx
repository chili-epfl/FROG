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

const checkDefined = item => typeof item !== 'undefined';

const MeanPerTryForEachInterface = props => {
  const { whichDash, data } = props;

  const count = data['count'];
  const dash = data[whichDash];

  const interfaces = Object.keys(dash);

  if (interfaces.length > 0) {
    const allCoordinates = interfaces.map(int => {
      const coordinates = [];

      for (let i = 0; i < 5; i += 1) {
        const shouldUpdate =
          checkDefined(dash[int]) &&
          checkDefined(count[int]) &&
          checkDefined(dash[int][i]) &&
          checkDefined(count[int][i]);

        if (shouldUpdate) {
          if (Number.isFinite(dash[int][i] / count[int][i])) {
            coordinates.push({
              x: i,
              y: dash[int][i] / count[int][i],
              fill: color(int)
            });
          }
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
      whichDash === 'error' ? { x: [0, 4], y: [0, 1] } : { x: [0, 4] };

    return (
      <Paper className={props.classes.root} elevation={4}>
        <Grid container>
          <Grid item xs={12}>
            <Typography align="center" variant="button" gutterBottom>
              Mean {whichDash} Per Try For Each Interface
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <VictoryChart>
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
