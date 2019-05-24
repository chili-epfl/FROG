import React from 'react';

import ChromeReaderMode from '@material-ui/icons/ChromeReaderMode';
import Dashboard from '@material-ui/icons/Dashboard';
import History from '@material-ui/icons/History';
import Delete from '@material-ui/icons/Delete';

class WikiTopNavbar extends React.Component<> {
  constructor(props) {
    super(props);

    this.state = {};
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
      history: 'primary',
      revisions: 'primary',
      delete: 'primary',
      dashboard: 'primary'
    };
    const activeItem = (() => {
      const { mode, docMode } = this.state;
      if (mode === 'document' && docMode === 'view') return 'document';
      if (mode === 'document' && docMode === 'history') return 'history';
      return mode;
    })();
    itemColors[activeItem] = 'secondary';

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
        {moreThanOnePage ? (
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
        <div style={topNavBarItemStyleName}>{Meteor.user().username}</div>
      </div>
    );
  }
}

export default WikiTopNavbar;
