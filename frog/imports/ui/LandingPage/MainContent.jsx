// @flow
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}));

type MainContentPropsT = {
  title: string,
  action?: string,
  callback?: () => void,
  children: React.Node | React.Node[]
};

const MainContent = ({
  title,
  action,
  callback,
  children
}: MainContentPropsT) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h5"> {title} </Typography>
            <Button color="primary" onClick={callback}>
              {action}
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </div>
  );
};

export default MainContent;