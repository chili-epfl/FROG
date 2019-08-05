// @flow
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import { ContentListItem } from './ContentListItem';

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
  itemList: Array<{
    itemTitle: string,
    status?: 'Ready' | 'Running' | 'Complete'
  }>,
  title: string,
  action?: string,
  itemIcon: React.ComponentType<*>,
  overflowitems: Array<{
    title: string,
    icon: React.ComponentType<*>,
    callback?: () => void
  }>
};

const MainContent = ({
  itemList,
  title,
  action,
  itemIcon,
  overflowitems
}: MainContentPropsT) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h5"> {title} </Typography>
            <Button color="primary"> {action} </Button>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <List>
            {itemList.map(item => (
              <ContentListItem
                itemTitle={item.itemTitle}
                itemIcon={itemIcon}
                status={item.status ? item.status : null}
                overflowitems={overflowitems}
              />
            ))}
          </List>
        </Grid>
      </Grid>
    </div>
  );
};

export default MainContent;
