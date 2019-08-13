import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, Grid, Typography, Paper } from '@material-ui/core';
import {
  Bookmark,
  Share,
  Forward,
  Delete,
  PlayArrow,
  Create,
  ChromeReaderMode,
  ShowChart,
  MoreHoriz
} from '@material-ui/icons';
import { ContentListItem } from '../LandingPage/ContentListItem';
import MainContent from '../LandingPage/MainContent';
import { Button } from '../Button';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.primary
  },
  card: {
    minWidth: 275
  },
  title: {
    fontSize: 20
  }
}));
const sessionOverflowItems = [
  { title: 'Share', icon: Share, callback: null },
  { title: 'Clone', icon: Forward, callback: null },
  { title: 'Delete', icon: Delete, callback: null }
];
const draftOverflowItems = [
  { title: 'Run', icon: PlayArrow, callback: null },
  { title: 'Edit', icon: Create, callback: null },
  { title: 'Delete', icon: Delete, callback: null }
];
export const RecentsPage = ({ sessionsList, draftsList, classList }) => {
  const classes = useStyles();
  return (
    <MainContent>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Paper className={classes.paper} elevation={0}>
              <Typography variant="h5" align="left">
                <ShowChart /> Drafts
              </Typography>

              <List>
                {draftsList.map(({ itemTitle }) => (
                  <ContentListItem
                    itemTitle={itemTitle}
                    itemIcon={ShowChart}
                    overflowitems={draftOverflowItems}
                  />
                ))}
              </List>
              <Button icon={<MoreHoriz />} variant="minimal">
                {' '}
                More
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper className={classes.paper} elevation={0}>
              <Typography variant="h5">
                <Bookmark /> Sessions
              </Typography>

              <List>
                {sessionsList.map(({ itemTitle, status }) => (
                  <ContentListItem
                    itemTitle={itemTitle}
                    status={status}
                    itemIcon={Bookmark}
                    overflowitems={sessionOverflowItems}
                  />
                ))}
              </List>
              <Button icon={<MoreHoriz />} variant="minimal">
                More
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className={classes.paper} elevation={0}>
              <Typography variant="h5">
                <ChromeReaderMode /> Classes
              </Typography>

              <List>
                {classList.map(({ title }) => (
                  <ContentListItem
                    itemTitle={title}
                    itemIcon={ChromeReaderMode}
                    overflowitems={draftOverflowItems}
                  />
                ))}
              </List>
              <Button icon={<MoreHoriz />} variant="minimal">
                More
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </MainContent>
  );
};
