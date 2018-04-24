// @flow

import * as React from 'react';
import { VictoryChart, VictoryBar, VictoryTooltip, VictoryAxis } from 'victory';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';

import { color, div } from './utils';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3
  })
});

const MeanPerInterface = ({
  whichDash,
  state,
  activity: {
    data: { iterationPerInterface }
  },
  classes
}: {
  whichDash: string,
  state: Object,
  activity: {
    data: {
      iterationPerInterface: number
    }
  },
  classes: Object
}) => {
  const count = state['count'];
  const dash = state[whichDash];

  const interfaces = Object.keys(dash);

  if (interfaces.length > 0) {
    const allInterfaces = ['dragdrop', 'form', 'graphical', 'command'];

    const coordinates = interfaces.map(int => {
      if (whichDash === 'help') {
        let countSum = 0;

        for (let i = 0; i < iterationPerInterface; i += 1) {
          countSum += count[int][i];
        }

        const avg = div(dash[int], countSum);
        const index = allInterfaces.indexOf(int) + 1;

        return {
          interface: index,
          avg,
          name: int
        };
      } else {
        let dashSum = 0;
        let countSum = 0;

        for (let i = 0; i < iterationPerInterface; i += 1) {
          dashSum += dash[int][i];
          countSum += count[int][i];
        }

        const avg = div(dashSum, countSum);
        const index = allInterfaces.indexOf(int) + 1;

        return {
          interface: index,
          avg,
          name: int,
          label: `${int}-> ${avg} sec`
        };
      }
    });

    const xDomain = whichDash === 'error' ? [0, 1] : null;

    return (
      <Paper className={classes.root} elevation={4}>
        <Grid container>
          <Grid item xs={12}>
            <Typography align="center" variant="button" gutterBottom>
              Mean {whichDash} per interface
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <VictoryChart
              domainPadding={20}
              padding={{ top: 50, left: 70, right: 0, bottom: 50 }}
            >
              <VictoryAxis
                dependentAxis
                tickValues={[1, 2, 3, 4]}
                tickFormat={allInterfaces}
              />
              <VictoryAxis domain={xDomain} />
              <VictoryBar
                horizontal
                style={{
                  data: {
                    fill: d => color(d.name)
                  }
                }}
                data={coordinates}
                x="interface"
                y="avg"
                labelComponent={<VictoryTooltip />}
              />
            </VictoryChart>
          </Grid>
        </Grid>
      </Paper>
    );
  } else {
    return (
      <Paper className={classes.root} elevation={4}>
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

export default withStyles(styles)(MeanPerInterface);
