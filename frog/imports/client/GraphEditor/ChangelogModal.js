/* eslint-disable react/no-array-index-key */

import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import changelog, { updateChangelogVersion } from '/imports/api/changelog';
import { withStyles } from '@material-ui/styles';

const styles = {
  paper: {
    width: '750px',
    height: '1000px'
  },
  appBar: { position: 'relative' },
  ul: { paddingBottom: '12px' }
};

class HelpModal extends React.Component<*, *> {
  componentDidUpdate() {
    if (Meteor.user()?.profile?.lastVersionChangelog !== changelog.length - 1)
      updateChangelogVersion();
  }

  render() {
    const version = Meteor.user()?.profile?.lastVersionChangelog;
    const { classes } = this.props;

    const logs =
      version === changelog.length - 1
        ? changelog.sort((a, b) => (a.date > b.date ? -1 : 1))
        : changelog
            .slice(version + 1)
            .sort((a, b) => (a.date > b.date ? -1 : 1));

    return (
      <Dialog
        open={this.props.show}
        onClose={this.props.hide}
        classes={{ paper: classes.paper }}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={this.props.hide}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" color="inherit">
              What is new in FROG
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          {logs.map(log => (
            <div key={log.date} style={{ padding: '10px' }}>
              <div key={log.date}>
                <h4>
                  {log.title} ({log.date.toDateString()})
                </h4>
                <ul className={classes.ul}>
                  {log.content.map((y, i) => (
                    <li key={i}>{y}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </List>
      </Dialog>
    );
  }
}

export default withStyles(styles)(HelpModal);
