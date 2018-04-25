// @flow
import * as React from 'react';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import { VictoryChart, VictoryLine, VictoryAxis } from 'victory';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3
  })
});

const MeanThrougOutStudy = ({
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
  const totalIterations = iterationPerInterface * 4;

  const count = state['sum']['count'];
  const dash = state['sum'][whichDash];

  if (count && count.length > 0) {
    const coordinates = [];

    for (let i = 0; i < totalIterations; i += 1) {
      if (Number.isFinite(dash[i] / count[i])) {
        coordinates.push({
          x: i + 1,
          y: dash[i] / count[i]
        });
      }
    }

    const domain =
      whichDash === 'time'
        ? { x: [1, totalIterations] }
        : { x: [1, totalIterations], y: [0, 1] };
    return (
      <React.Fragment>
        <Paper className={classes.root} elevation={4}>
          <Grid container>
            <Grid item xs={12}>
              <Typography align="center" variant="button" gutterBottom>
                Mean {whichDash} throughout study
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <VictoryChart domainPadding={{ y: 15 }}>
                <VictoryAxis
                  tickCount={iterationPerInterface}
                  tickFormat={t => Math.round(t)}
                />
                <VictoryAxis dependentAxis />
                <VictoryLine
                  domain={domain}
                  style={{
                    data: { stroke: 'blue' },
                    parent: { border: '1px solid #ccc' }
                  }}
                  data={coordinates}
                />
              </VictoryChart>
            </Grid>
          </Grid>
        </Paper>
      </React.Fragment>
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

export default withStyles(styles)(MeanThrougOutStudy);
