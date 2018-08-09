import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import changelog, { updateChangelogVersion } from '/imports/api/changelog';

const Transition = props => <Slide direction="up" {...props} />;

class HelpModal extends React.Component<*, *> {
  componentDidUpdate() {
    if (Meteor.user().lastVersionChangelog !== changelog.length - 1)
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
      >
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
        <List style={{ top: '50px' }}>
          {version === undefined || version === changelog.length - 1
            ? changelog.reverse().map((log, i) => (
                <div
                  key={Object.keys(log)[0]}
                  style={{ border: '1px solid #DDDDDD', padding: '10px' }}
                >
                  <h3>{'Release ' + (changelog.length - 1 - i)}</h3>
                  {Object.keys(changelog[i]).map(x => (
                    <div key={x}>
                      <h4>{x}</h4>
                      {changelog[i][x]
                        .split('<br/>')
                        .map(y => <p key={y}>{y}</p>)}
                    </div>
                  ))}
                </div>
              ))
            : changelog
                .slice(version + 1)
                .reverse()
                .map((log, i) => (
                  <div
                    key={Object.keys(log)[0]}
                    style={{ border: '1px solid', padding: '10px' }}
                  >
                    <h3>{'Release ' + (changelog.length - 1 - i)}</h3>
                    {Object.keys(changelog[changelog.length - 1 - i]).map(x => (
                      <div key={x}>
                        <h4>{x}</h4>
                        {changelog[changelog.length - 1 - i][x]
                          .split('<br/>')
                          .map(y => <p key={y}>{y}</p>)}
                      </div>
                    ))}
                  </div>
                ))}
        </List>
      </Dialog>
    );
  }
}

export default HelpModal;
