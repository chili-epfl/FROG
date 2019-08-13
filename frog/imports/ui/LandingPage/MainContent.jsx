// @flow
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  icons: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  filter: {
    pointer: 'cursor'
  }
}));

type MainContentPropsT = {
  title?: string,
  action?: string,
  callback?: () => void,
  children: React.Node | React.Node[]
};

const MainContent = ({ children }: MainContentPropsT) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </div>
  );
};

export default MainContent;
