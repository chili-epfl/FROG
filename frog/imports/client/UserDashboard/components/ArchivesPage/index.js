// @flow
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, Grid, Typography, Paper } from '@material-ui/core';
import ArchiveIcon from '@material-ui/icons/Archive';
import { ArchivesListT } from '/imports/ui/Types/types';
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
  }
}));

type ArchivesPagePropsT = {
  archivesList: ArchivesListT,
  actionCallback: () => void
};

export const ArchivesPage = ({
  archivesList,
  actionCallback
}: ArchivesPagePropsT) => {
  const classes = useStyles();
  return (
    <Grid container>
      <Grid item xs={12}>
        <Paper className={classes.paper} elevation={0}>
          <div className={classes.buttonRows}>
            <Typography variant="h5" align="left">
              <ArchiveIcon /> Archives
            </Typography>
          </div>

          <List>
            {archivesList.map(
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
