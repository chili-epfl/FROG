import React from 'react';
import { WikiContext } from 'frog-utils';
import 'mousetrap/plugins/global-bind/mousetrap-global-bind.min.js';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Edit from '@material-ui/icons/Edit';
import Check from '@material-ui/icons/Check';
import { TextField, FormHelperText, FormControl } from '@material-ui/core';

import { wikiStore } from './store';
import LIDashboard from '../Dashboard/LIDashboard';
import Revisions from './Revisions';
import WikiLink from './WikiLink';
import { LearningItem } from './index';
import { getPageDetailsForLiId, checkNewPageTitle } from './helpers.js';

class WikiContentComp extends React.Component<> {
  constructor(props) {
    super(props);

    this.wikiContext = {
      side: this.props.side,
      getOnlyValidWikiPages: () =>
        this.props.mode === 'splitview'
          ? wikiStore.pagesArrayOnlyValid
          : wikiStore.pagesArrayOnlyValid.filter(
              x => x.id !== this.props.currentPageObj?.id
            )
    };

    window.WikiLink = WikiLink;

    this.state = {
      docMode: 'view',
      pageTitleString: this.props.currentPageObj?.title,
      e: false,
      showTitleEditButton: false,
      error: null
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentPageObj.id !== this.props.currentPageObj.id) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        docMode: 'view',
        pageTitleString: this.props.currentPageObj.title,
        editingTitle: false,
        showTitleEditButton: false,
        error: null
      });
    }
  }

  clearErrors = () => {
    this.setState({ error: null });
  };

  handleEditingTitle = () => {
    this.setState(prevState => ({
      editingTitle: !prevState.editingTitle
    }));
  };

  handleErrors = newPageTitle => {
    const error = checkNewPageTitle(wikiStore.parsedPages, newPageTitle);
    if (error) {
      this.setState({ error });
    } else {
      this.setState({ error });
    }
    return error;
  };

  handleErrorClearing(currentTitle) {
    if (
      currentTitle === '' ||
      (currentTitle.length > 0 && this.state.error === 'Title cannot be empty')
    )
      this.clearErrors();
  }

  saveNewPageTitle = () => {
    const { pageTitleString } = this.state;
    const error = this.handleErrors(pageTitleString);
    if (error === null) {
      this.props.changeTitle(this.props.currentPageObj.id, pageTitleString);
      this.setState({
        pageTitleString,
        editingTitle: false,
        showTitleEditButton: false
      });
    }
  };

  render() {
    const widthSize = this.props.side ? '50%' : '100%';
    const contentDivStyle = {
      flex: 'auto',
      display: 'inline-flex',
      flexDirection: 'column',
      height: '100%',
      width: widthSize,
      borderRight: this.props.side === 'left' ? '1px solid lightgrey' : '0px'
    };

    const titleDivStyle = {
      display: 'flex',
      flex: '0 0 50px',
      width: '100%',
      alignItems: 'center',
      fontSize: '30px',
      padding: '0 20px'
    };

    const docModeButtonStyle = {
      fontSize: '14px',
      marginRight: '20px',
      width: '150px',
      border: '1px lightgray solid'
    };

    const titleStyle = {
      lineHeight: '1.2'
    };

    const docModeButton = () => {
      if (
        this.state.docMode === 'history' ||
        this.props.liType === 'li-activity'
      )
        return null;
      if (this.state.docMode === 'view')
        return (
          <Button
            style={docModeButtonStyle}
            color="primary"
            onClick={() => {
              this.setState({ docMode: 'edit' });
            }}
          >
            Edit Page
          </Button>
        );
      return (
        <Button
          style={docModeButtonStyle}
          color="primary"
          onClick={() => {
            this.setState({ docMode: 'view' });
          }}
        >
          Finish
        </Button>
      );
    };

    const titleDiv = this.state.editingTitle ? (
      <div style={titleDivStyle}>
        <FormControl margin="normal">
          <TextField
            id="title-input"
            placeholder="New Title"
            error={this.state.error !== null}
            value={this.state.pageTitleString}
            onChange={e => {
              this.setState({ pageTitleString: e.target.value });
              this.handleErrorClearing(e.target.value);
            }}
            aria-describedby="title-input-helper-text"
          />
          {this.state.error !== null && (
            <FormHelperText id="title-input-helper-text" error>
              {' '}
              {this.state.error}{' '}
            </FormHelperText>
          )}
        </FormControl>

        <Check onClick={() => this.saveNewPageTitle()} />
        <div style={{ flex: '1', textAlign: 'right' }}>{docModeButton}</div>
      </div>
    ) : (
      <div style={titleDivStyle}>
        <div
          onMouseEnter={() => {
            this.setState({ showTitleEditButton: true });
          }}
          onMouseLeave={() => {
            this.setState({ showTitleEditButton: false });
          }}
        >
          <span style={titleStyle}>{this.state.pageTitleString}</span>
          {this.state.showTitleEditButton && (
            <Edit
              onClick={this.handleEditingTitle}
              style={{ height: '20px' }}
            />
          )}
        </div>
        <div style={{ flex: '1', textAlign: 'right' }}>{docModeButton}</div>
      </div>
    );

    return (
      <WikiContext.Provider value={this.wikiContext}>
        <div style={contentDivStyle}>
          {this.props.mode === 'revisions' && (
            <Revisions doc={this.props.currentPageObj.liId} />
          )}
          {this.props.mode === 'dashboard' && (
            <Paper
              elevation={24}
              style={{
                overflow: 'auto',
                height: '100%',
                padding: '10px'
              }}
            >
              <LIDashboard
                wikiId={this.props.wikiId}
                search={this.props.dashboardSearch}
                onClick={liId => {
                  const { pageId, instanceId } = getPageDetailsForLiId(
                    wikiStore.pages,
                    liId
                  );
                  this.props.goToPage(pageId, null, null, instanceId);
                  this.setState({ docMode: 'view' });
                }}
              />
            </Paper>
          )}
          {(this.props.mode === 'document' ||
            this.props.mode === 'splitview') && (
            <>
              {titleDiv}
              <div
                style={{
                  height: 'calc(100vh - 102px)',
                  overflow: 'hidden'
                }}
              >
                <Paper
                  elevation={24}
                  style={{
                    height: '100%',
                    backgroundColor:
                      this.state.docMode === 'edit' ? '#ffffff' : '#fbffe0'
                  }}
                  onDoubleClick={() => {
                    if (this.state.docMode === 'view') {
                      this.setState({ docMode: 'edit' });
                    }
                  }}
                >
                  {this.props.currentPageObj && (
                    <LearningItem
                      type={this.state.docMode}
                      id={this.props.currentPageObj.liId}
                    />
                  )}
                </Paper>
              </div>
            </>
          )}
        </div>
      </WikiContext.Provider>
    );
  }
}

export default WikiContentComp;
