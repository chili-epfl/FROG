import React from 'react';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';

const drop = ['from', 'to', 'travel', 'class', 'fare', 'other'];

const styles = theme => ({
  paper: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
    height: '100px'
  })
});

const DropElements = ({ classes }) => (
  <React.Fragment>
    <Typography variant="title" gutterBottom align="center">
      Your Ticket
    </Typography>
    <Grid container>
      {drop.map(box => (
        <Grid key={box} item xs={12} sm={6}>
          <Paper className={classes.paper} elevation={4}>
            <Typography align="center">{box}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </React.Fragment>
);

export default withStyles(styles)(DropElements);
