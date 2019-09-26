// @flow
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, Grid, Typography, Paper } from '@material-ui/core';
import { Bookmark, ShowChart, MoreHoriz, Add } from '@material-ui/icons';
import {
  SessionListT,
  archivesDraftsT,
  archivesTemplatesT
} from '/imports/ui/Types/types';
import { ContentListItem } from '/imports/ui/ListItem';
import { Button } from '/imports/ui/Button';
import DescriptionIcon from '@material-ui/icons/Description';

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
  archivesSessions: SessionListT,
  archivesDrafts: DraftsListT,
  archivesTemplates: TemplatesListT,
  actionCallback: () => void
};

export const ArchivesPage = ({
  archivesSessions,
  archivesDrafts,
  archivesTemplates,
  actionCallback
}: ArchivesPagePropsT) => {
  const classes = useStyles();
  return (
    <Grid container>
      {archivesDrafts.length > 0 && (
        <Grid
          item
          xs={
            archivesSessions.length > 0 || archivesTemplates.length > 0 ? 6 : 12
          }
        >
          <Paper className={classes.paper} elevation={0}>
            <div className={classes.buttonRows}>
              <Typography variant="h5" align="left">
                <ShowChart /> Drafts
              </Typography>
              <Button
                icon={<Add />}
                onClick={actionCallback}
                variant="primary"
              />
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
        <Grid
          item
          xs={
            archivesDrafts.length > 0 || archivesTemplates.length > 0 ? 6 : 12
          }
        >
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
      {archivesTemplates.length > 0 && (
        <Grid
          item
          xs={archivesSessions.length > 0 || archivesDrafts.length > 0 ? 6 : 12}
        >
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
  );
};
