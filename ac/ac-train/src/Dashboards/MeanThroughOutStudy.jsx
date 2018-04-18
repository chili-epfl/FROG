// @flow
import * as React from 'react';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import { VictoryChart, VictoryLine } from 'victory';

import { div } from './utils';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3
  })
});

const MeanThrougOutStudy = props => {
  const { whichDash, data } = props;

  const count = data['sum']['count'];
  const dash = data['sum'][whichDash];

  let index = 0;

  for (let i = 0; i < 20; i += 1) {
    if (i !== 0 && count[i] === 0) {
      index = i;
      break;
    }
  }

  const coordinates = [];
  for (let i = 0; i < index; i += 1) {
    coordinates.push({
      x: i,
      y: div(dash[i], count[i])
    });
  }

  const domain =
    whichDash === 'time' ? { x: [0, 19] } : { x: [0, 19], y: [0, 1] };

  return (
    <React.Fragment>
      <Paper className={props.classes.root} elevation={4}>
        <Grid container>
          <Grid item xs={12}>
            <Typography align="center" variant="button" gutterBottom>
              Mean {whichDash} throughout study
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <VictoryChart domainPadding={{ y: 15 }}>
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
};

export default withStyles(styles)(MeanThrougOutStudy);
