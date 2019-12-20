// @flow
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, Grid, Typography, Paper } from '@material-ui/core';
import { ShowChart, Add } from '@material-ui/icons';
import { DraftsListT } from '/imports/ui/Types/types';
import { ContentListItem } from '/imports/ui/ListItem';
import { Button } from '/imports/ui/Button';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.primary
  },
  buttonRows: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  icon: {
    color: theme.palette.secondary.main
  }
}));

type DraftsPagePropsT = {
  draftsList: DraftsListT,
  actionCallback: () => void
};

export const DraftsPage = ({
  draftsList,
  actionCallback
}: DraftsPagePropsT) => {
  const classes = useStyles();
  return (
    <Grid container>
      <Grid item xs={12}>
        <Paper className={classes.paper} elevation={0}>
          <div className={classes.buttonRows}>
            <Typography variant="h5" align="left">
              <ShowChart className={classes.icon} /> Drafts
            </Typography>
            <Button icon={<Add />} onClick={actionCallback} variant="primary" />
          </div>

          <List>
            {draftsList.map((props, index) => (
              <ContentListItem key={index} {...props} />
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
};
