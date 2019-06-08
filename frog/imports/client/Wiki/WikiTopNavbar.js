import React from 'react';

import ChromeReaderMode from '@material-ui/icons/ChromeReaderMode';
import Dashboard from '@material-ui/icons/Dashboard';
import History from '@material-ui/icons/History';
import Delete from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Settings from '@material-ui/icons/Settings';
import ImportContacts from '@material-ui/icons/ImportContacts';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';

class SettingsMenu extends React.Component<*, *> {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;

    return (
      <div>
        <IconButton
          aria-owns={anchorEl ? 'simple-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <Settings />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem
            onClick={() => {
              this.props.openRestoreModal();
              this.handleClose();
            }}
          >
            Restore deleted pages
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export default props => {
  const user = Meteor.user();

  const {
    currentPageObj,
    changeMode,
    deleteLI,
    moreThanOnePage,
    history,
    openRestoreModal
  } = props;
  const topNavBarStyle = {
    display: 'flex',
    flex: '0 0 50px',
    cursor: 'pointer',
    width: '100%',
    backgroundColor: 'white',
    borderBottom: '1px lightgrey solid'
  };

  const topNavBarItemWidth = moreThanOnePage ? '20%' : '25%';

  const topNavBarItemStyle = {
    display: 'inline-flex',
    width: topNavBarItemWidth,
    alignItems: 'center',
    justifyContent: 'center',
    height: '50px',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '20px 0'
  };

  const topNavBarItemStyleName = {
    ...topNavBarItemStyle,
    fontWeight: 'bold'
  };

  const iconButtonStyle = {
    marginRight: '5px'
  };

  const itemColors = {
    document: 'primary',
    revisions: 'primary',
    delete: 'primary',
    dashboard: 'primary',
    splitview: 'primary'
  };

  itemColors[props.mode] = 'secondary';

  return (
    <div style={topNavBarStyle}>
      <div
        style={topNavBarItemStyle}
        onClick={() => {
          changeMode('document');
        }}
      >
        <ChromeReaderMode
          style={iconButtonStyle}
          color={itemColors['document']}
        />
        <span style={{ color: itemColors['document'] }}>Page</span>
      </div>
      <div
        style={topNavBarItemStyle}
        onClick={() => {
          changeMode('revisions');
        }}
      >
        <History style={iconButtonStyle} color={itemColors['revisions']} />
        <span style={{ color: itemColors['revisions'] }}>Revisions</span>
      </div>
      <div
        style={topNavBarItemStyle}
        onClick={() => {
          changeMode('dashboard');
        }}
      >
        <Dashboard style={iconButtonStyle} color={itemColors['dashboard']} />
        <span style={{ color: itemColors['dashboard'] }}>All Pages</span>
      </div>
      <div
        style={topNavBarItemStyle}
        onClick={() => {
          changeMode('splitview');
        }}
      >
        <ImportContacts
          style={iconButtonStyle}
          color={itemColors['splitview']}
        />
        <span style={{ color: itemColors['splitview'] }}>Split View</span>
      </div>
      {moreThanOnePage && props.mode !== 'splitview' ? (
        <div
          style={topNavBarItemStyle}
          onClick={() => {
            deleteLI(currentPageObj.id);
          }}
        >
          <Delete style={iconButtonStyle} color={itemColors['delete']} />
          <span style={{ color: itemColors['delete'] }}>Delete Page</span>
        </div>
      ) : (
        <div />
      )}
      <div style={topNavBarItemStyleName}>
        <span> {user.isAnonymous ? 'Anonymous Visitor' : user.username} </span>
        <SettingsMenu openRestoreModal={openRestoreModal} />
        <Button
          style={iconButtonStyle}
          color="primary"
          onClick={() => {
            sessionStorage.removeItem('frog.sessionToken');
            Meteor.logout();
            history.push('/');
            window.notReady();
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};
