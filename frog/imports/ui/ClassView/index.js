// @flow
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
import { SessionListT } from '../Types/types';
import { ContentListItem } from '../ListItem';
import { MainContent } from '../MainContent';

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

type ClassViewPropsT = {
  sessionsList: SessionListT,
  wikiInfo: { title: string, pagesCount: number },
  numberOfStudents: number
};
export const ClassView = ({
  sessionsList,
  wikiInfo,
  numberOfStudents
}: ClassViewPropsT) => {
  const classes = useStyles();
  return (
    <MainContent title="Class Slug: XKCD">
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h5">
                <Bookmark /> Sessions
              </Typography>

              <List className={classes.list}>
                {sessionsList.map(
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
                      itemTitle={itemTitle}
                      itemIcon={itemIcon}
                      status={status}
                      itemType={itemType}
                      dateCreated={dateCreated}
                      secondaryActions={secondaryActions}
                      callback={callback}
                    />
                  )
                )}
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
                    Visit
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
                    View student list
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
