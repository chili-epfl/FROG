// @flow
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, Grid, Typography, Paper } from '@material-ui/core';
import { ShowChart } from '@material-ui/icons';
import { DraftsListT } from '/imports/ui/Types/types';
import { ContentListItem } from '/imports/ui/ListItem';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.primary
  }
}));

type DraftsPagePropsT = {
  sessionsList: DraftsListT
};

export const DraftsPage = ({ draftsList }: DraftsPagePropsT) => {
  const classes = useStyles();
  return (
    <Grid container>
      <Grid item xs={12}>
        <Paper className={classes.paper} elevation={0}>
          <Typography variant="h5" align="left">
            <ShowChart /> Drafts
          </Typography>

          <List>
            {draftsList.map(
              (
                {
                  itemIcon,
                  itemTitle,
                  itemType,
                  dateCreated,
                  callback,
                  secondaryActions
                },
                index
              ) => (
                <ContentListItem
                  key={index}
                  itemTitle={itemTitle}
                  itemIcon={itemIcon}
                  itemType={itemType}
                  dateCreated={dateCreated}
                  callback={callback}
                  secondaryActions={secondaryActions}
                />
              )
            )}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
};
