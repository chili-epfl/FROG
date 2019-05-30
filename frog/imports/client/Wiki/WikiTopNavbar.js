import React from 'react';

import ChromeReaderMode from '@material-ui/icons/ChromeReaderMode';
import Dashboard from '@material-ui/icons/Dashboard';
import History from '@material-ui/icons/History';
import Delete from '@material-ui/icons/Delete';
import ImportContacts from '@material-ui/icons/ImportContacts';

class WikiTopNavbar extends React.Component<{ username: string }> {
  constructor() {
    super();
    this.state = {
      username: '...'
    };
    Meteor.subscribe('userData', () => {
      const user = Meteor.users.findOne();
      this.setState({
        username: user.isAnonymous ? 'Anonymous Visitor' : user.username
      });
    });
  }

  render() {
    const {
      currentPageObj,
      changeMode,
      deleteLI,
      moreThanOnePage
    } = this.props;
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

    itemColors[this.props.mode] = 'secondary';

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
        {moreThanOnePage && this.props.mode !== 'splitview' ? (
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
        <div style={topNavBarItemStyleName}>{this.state.username}</div>
      </div>
    );
  }
}

export default WikiTopNavbar;
