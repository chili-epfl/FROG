import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { WikiContext, values, uuid } from 'frog-utils';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Meteor } from 'meteor/meteor';
import { findKey, flatMap } from 'lodash';
import Mousetrap from 'mousetrap';
import 'mousetrap/plugins/global-bind/mousetrap-global-bind.min.js';
import { toObject as queryToObject } from 'query-parse';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Edit from '@material-ui/icons/Edit';
import Check from '@material-ui/icons/Check';
import ChromeReaderMode from '@material-ui/icons/ChromeReaderMode';
import Dashboard from '@material-ui/icons/Dashboard';
import History from '@material-ui/icons/History';
import Delete from '@material-ui/icons/Delete';
import { connection } from '../App/connection';
import { generateReactiveFn } from '/imports/api/generateReactiveFn';
import LI from '../LearningItem';
import { activityTypesObj } from '/imports/activityTypes';
import { parseDocResults, getPageTitle } from './helpers';
import {
  addNewWikiPage,
  invalidateWikiPage,
  changeWikiPageTitle,
  markPageAsCreated,
  addInstance,
  restoreWikiPage,
  changeWikiPageLI
} from '/imports/api/wikiDocHelpers';
import { wikiStore } from './store';
import LIDashboard from '../Dashboard/LIDashboard';
import Revisions from './Revisions';
import CreateModal from './ModalCreate';
import DeletedPageModal from './ModalDeletedPage';
import FindModal, { SearchAndFind } from './ModalFind';

const genericDoc = connection.get('li');
const dataFn = generateReactiveFn(genericDoc, LI, {
  createdByUser: Meteor.userId()
});
const LearningItem = dataFn.LearningItem;

class WikiContentComp extends React.Component<> {
  constructor(props) {
    super(props);

    window.WikiLink = this.WikiLink;

    this.state = {
      docMode: 'view',
      pageTitleString: this.props.currentPageObj?.title,
      editingTitle: false,
      showTitleEditButton: false
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentPageObj.id !== this.props.currentPageObj.id) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        docMode: 'view',
        pageTitleString: this.props.currentPageObj.title,
        editingTitle: false,
        showTitleEditButton: false
      });
    }
  }

  WikiLink = observer(({ data }) => {
    const pageObj = wikiStore.pages[data.id];

    const style = {
      textDecoration: 'underline',
      cursor: 'pointer',
      color: 'black'
    };

    if (!pageObj) {
      return <span style={style}>INVALID LINK</span>;
    }

    const pageId = pageObj.id;
    const pageTitle = pageObj.title;
    const displayTitle = pageTitle + (data.instance ? '/' + data.instance : '');

    if (!pageObj.created) {
      const createLinkFn = e => {
        e.preventDefault();
        markPageAsCreated(this.props.wikiDoc, pageObj.id);
        this.props.goToPage(pageId, null, this.props.side);
      };
      style.color = 'green';

      return (
        <span onClick={createLinkFn} style={style}>
          <b>{displayTitle}</b>
        </span>
      );
    }

    if (!pageObj.valid) {
      const deletedPageLinkFn = e => {
        e.preventDefault();
        this.props.openDeletedPageModal(pageId, pageTitle);
      };
      style.color = 'red';

      return (
        <span onClick={deletedPageLinkFn} style={style}>
          {pageTitle}
        </span>
      );
    }

    const linkFn = e => {
      e.preventDefault();
      this.props.goToPage(pageId, null, this.props.side);
    };
    style.color = 'blue';

    return (
      <span onClick={linkFn} style={style}>
        <b>{displayTitle}</b>
      </span>
    );
  });

  handleEditingTitle = () => {
    this.setState(prevState => ({
      editingTitle: !prevState.editingTitle
    }));
  };

  saveNewPageTitle = () => {
    const newPageTitle = this.state.pageTitleString;
    if (!newPageTitle) throw new Error('Cannot save empty new page title');

    this.props.changeTitle(this.props.currentPageObj.id, newPageTitle);

    this.setState({
      pageTitleString: newPageTitle,
      editingTitle: false,
      showTitleEditButton: false
    });
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

    const docModeButton = (() => {
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
    })();

    const titleDiv = this.state.editingTitle ? (
      <div style={titleDivStyle}>
        <div>
          <input
            placeholder="New Title"
            value={this.state.pageTitleString}
            onChange={e => {
              this.setState({ pageTitleString: e.target.value });
            }}
          />
          <Check onClick={() => this.saveNewPageTitle()} />
        </div>
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
          <span>{this.state.pageTitleString}</span>
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
              wikiId={this.wikiId}
              search={this.state.dashboardSearch}
              onClick={id => {
                const page = values(toJS(wikiStore.pages)).find(
                  x => x.liId === id
                ).title;
                this.props.history.push(`/wiki/${this.wikiId}/${page}`);
                this.props.changeMode('document');
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
    );
  }
}

export default WikiContentComp;
