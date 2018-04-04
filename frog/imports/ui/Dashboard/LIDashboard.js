// @flow
import * as React from 'react';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import classNames from 'classnames';
import AppBar from 'material-ui/AppBar';
import Card from 'material-ui/Card';
import Toolbar from 'material-ui/Toolbar';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import LearningItem from '../StudentView/LearningItemRenderer';

import { connection } from '../App/connection';

const drawerWidth = 240;
const styles = theme => ({
  dialog: {},
  root: {
    layout: 'flex',
    flexDirection: 'row',
    width: '900px'
  },
  appFrame: {
    height: '900px',
    width: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex'
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth
  },
  toolbar: theme.mixins.toolbar,
  content: {
    width: '900px',
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3
  }
});

class Dashboard extends React.Component<any, any> {
  state = { results: [] };

  componentDidMount() {
    const subscription = connection.createSubscribeQuery(
      'li',
      { sessionId: this.props.sessionId },
      {},
      (err, results) =>
        this.setState({ results: results.map(x => ({ ...x.data, id: x.id })) })
    );
    subscription.on('changed', e =>
      this.setState({ results: e.map(x => ({ ...x.data, id: x.id })) })
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <Dialog aria-labelledby="simple-dialog-title" open>
        <div className={classes.root}>
          <div className={classes.appFrame}>
            <AppBar position="absolute" className={classNames(classes.appBar)}>
              <Toolbar>
                <Typography variant="title" color="inherit" noWrap>
                  Permanent drawer
                </Typography>
              </Toolbar>
            </AppBar>
            <Drawer
              variant="permanent"
              classes={{
                paper: classes.drawerPaper
              }}
            >
              <div className={classes.toolbar} />
              <Divider />
              <List>
                <ListItem button>
                  <ListItemText primary="Inbox" />
                </ListItem>{' '}
              </List>
              <Divider />
            </Drawer>
            <main className={classes.content}>
              <div className={classes.toolbar} />
              <Card elevation={24}>
                {this.state.results.map(x => (
                  <LearningItem
                    type="viewThumb"
                    id={x.id}
                    key={x.id}
                    clickZoomable
                  />
                ))}
              </Card>
            </main>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles)(Dashboard);
