import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import changelog, { updateChangelogVersion } from '/imports/api/changelog';
import { withStyles } from '@material-ui/core/styles';

const Transition = props => <Slide direction="up" {...props} />;

const styles = {
  paper: {
    width: '750px',
    height: '1000px'
  }
};

class HelpModal extends React.Component<*, *> {
  componentDidUpdate() {
    if (Meteor.user().profile.lastVersionChangelog !== changelog.length - 1)
      updateChangelogVersion();
  }

  render() {
    const version = Meteor.user().profile
      ? Meteor.user().profile.lastVersionChangelog
      : undefined;
    return (
      <Dialog
        open={this.props.show}
        onClose={this.props.hide}
        TransitionComponent={Transition}
        classes={this.props.classes}
      >
        <DialogTitle id="scroll-dialog-title">
          <AppBar>
            <Toolbar>
              <IconButton
                color="inherit"
                onClick={this.props.hide}
                aria-label="Close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit">
                {version === changelog.length - 1
                  ? 'Help for the graph editor'
                  : 'What is new in FROG'}
              </Typography>
            </Toolbar>
          </AppBar>
        </DialogTitle>
        <List style={{ top: '50px' }}>
          {version === changelog.length - 1
            ? changelog.sort((a, b) => (a.date > b.date ? -1 : 1)).map(log => (
                <div key={log.date} style={{ padding: '10px' }}>
                  {Object.keys(log)
                    .filter(y => y !== 'date')
                    .map(x => (
                      <div key={x}>
                        <h4>
                          {x} ({log.date.toDateString()})
                        </h4>
                        {log[x].split('<br/>').map(y => <p key={y}>{y}</p>)}
                      </div>
                    ))}
                </div>
              ))
            : changelog
                .slice(version + 1)
                .sort((a, b) => (a.date > b.date ? -1 : 1))
                .map(log => (
                  <div
                    key={log.date}
                    style={{ border: '1px solid', padding: '10px' }}
                  >
                    {Object.keys(log)
                      .filter(y => y !== 'date')
                      .map(x => (
                        <div key={x}>
                          <h4>
                            {x} ({log.date.toDateString()})
                          </h4>
                          {log[x].split('<br/>').map(y => <p key={y}>{y}</p>)}
                        </div>
                      ))}
                  </div>
                ))}
        </List>
      </Dialog>
    );
  }
}

export default withStyles(styles)(HelpModal);
