// @flow
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, Grid, Typography, Paper } from '@material-ui/core';
import { Bookmark, ShowChart, MoreHoriz } from '@material-ui/icons';
import DescriptionIcon from '@material-ui/icons/Description';
import {
  DraftsListT,
  SessionsListT,
  TemplatesListT
} from '/imports/ui/Types/types';
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
  archivesDrafts: DraftsListT,
  archivesSessions: SessionsListT,
  archivesTemplates: TemplatesListT,
  actionCallback: () => void
};

export const ArchivesPage = ({
  archivesDrafts,
  archivesSessions,
  archivesTemplates,
  actionCallback
}: ArchivesPagePropsT) => {
  const classes = useStyles();
  return (
    <>
      <Grid container>
        {archivesDrafts.length > 0 && (
          <Grid item xs={6}>
            <Paper className={classes.paper} elevation={0}>
              <div className={classes.buttonRows}>
                <Typography variant="h5" align="left">
                  <ShowChart /> Drafts
                </Typography>
              </div>

              <List>
                {archivesDrafts.map(
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
                  ) => {
                    return (
                      <ContentListItem
                        key={index}
                        itemTitle={itemTitle}
                        itemIcon={itemIcon}
                        itemType={itemType}
                        dateCreated={dateCreated}
                        callback={callback}
                        secondaryActions={secondaryActions}
                      />
                    );
                  }
                )}
              </List>
            </Paper>
          </Grid>
        )}

        {archivesSessions.length > 0 && (
          <Grid item xs={6}>
            <Paper className={classes.paper} elevation={0}>
              <Typography variant="h5">
                <Bookmark /> Sessions
              </Typography>

              <List dense>
                {archivesSessions.map(
                  (
                    {
                      itemIcon,
                      itemTitle,
                      status,
                      itemType,
                      dateCreated,
                      callback,
                      secondaryActions
                    },
                    index
                  ) => (
                    <ContentListItem
                      key={index}
                      itemIcon={itemIcon}
                      itemTitle={itemTitle}
                      itemType={itemType}
                      dateCreated={dateCreated}
                      status={status}
                      callback={callback}
                      secondaryActions={secondaryActions}
                    />
                  )
                )}
              </List>
            </Paper>
          </Grid>
        )}
      </Grid>
      <Grid container>
        {archivesTemplates.length > 0 && (
          <Grid item xs={6}>
            <Paper className={classes.paper} elevation={0}>
              <div className={classes.buttonRows}>
                <Typography variant="h5" align="left">
                  <DescriptionIcon /> Templates
                </Typography>
              </div>

              <List>
                {archivesTemplates.map(
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
                  ) => {
                    return (
                      <ContentListItem
                        key={index}
                        itemTitle={itemTitle}
                        itemIcon={itemIcon}
                        itemType={itemType}
                        dateCreated={dateCreated}
                        callback={callback}
                        secondaryActions={secondaryActions}
                      />
                    );
                  }
                )}
              </List>
            </Paper>
          </Grid>
        )}
      </Grid>
    </>
  );
};
