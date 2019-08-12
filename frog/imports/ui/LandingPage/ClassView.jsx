import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  List,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button
} from '@material-ui/core';
import { Bookmark, ChromeReaderMode } from '@material-ui/icons';
import { ContentListItem } from './ContentListItem';
import MainContent from './MainContent';

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
  },
  list: {
    maxHeight: '200',
    overflow: 'auto'
  }
}));

export const ClassView = ({
  sessionsList,
  wikiInfo,
  overflowitems,
  numberOfStudents
}) => {
  const classes = useStyles();
  return (
    <MainContent title="Class Slug: XKCD">
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h5">
                {' '}
                <Bookmark /> Sessions{' '}
              </Typography>

              <List className={classes.list}>
                {sessionsList.map(({ itemTitle, status }) => (
                  <ContentListItem
                    itemTitle={itemTitle}
                    status={status}
                    itemIcon={Bookmark}
                    overflowitems={overflowitems}
                  />
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper} elevation={0}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    <ChromeReaderMode /> Class Wiki
                  </Typography>
                  <Typography variant="subtitle2" component="p">
                    {wikiInfo.title}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    {' '}
                    Visit{' '}
                  </Button>
                </CardActions>
              </Card>
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper className={classes.paper} elevation={0}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    <ChromeReaderMode /> Student Information
                  </Typography>
                  <Typography variant="subtitle2">
                    Number of students: {numberOfStudents}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    {' '}
                    View student list{' '}
                  </Button>
                </CardActions>
              </Card>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </MainContent>
  );
};
