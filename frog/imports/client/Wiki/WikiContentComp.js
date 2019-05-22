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
import {
  parseDocResults,
  parsePageObjForReactiveRichText,
  getPageTitle
} from './helpers';
import {
  addNewWikiPage,
  invalidateWikiPage,
  changeWikiPageTitle,
  markPageAsCreated,
  addInstance,
  restoreWikiPage,
  changeWikiPageLI
} from '/imports/api/wikiDocHelpers';
import { wikistore } from './store';
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

    this.state = {
      docMode: 'view'
    };
  }

  handleEditingTitle = () => {
    this.setState(prevState => ({
      editingTitle: !prevState.editingTitle
    }));
  };

  saveNewPageTitle = () => {
    const newPageTitle = this.state.pageTitleString;
    if (!newPageTitle) throw new Error('Cannot save empty new page title');

    changeWikiPageTitle(
      this.wikiDoc,
      this.state.pageId,
      this.state.pageTitle,
      newPageTitle
    );

    this.setState(
      {
        pageTitle: newPageTitle,
        editingTitle: false,
        showTitleEditButton: false
      },
      () => {
        const link = '/wiki/' + this.wikiId + '/' + newPageTitle;
        this.props.history.replace(link);
      }
    );
  };

  render() {
    const contentDivStyle = {
      flex: 'auto',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: 'calc(100vw - 250px)'
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
          <span>
            {this.state.page?.title +
              (this.state.page?.plane !== 3
                ? this.state.urlInstance
                  ? ' / ' + this.getInstanceName(this.state.page)
                  : ' (' + this.getInstanceName(this.state.page) + ')'
                : '')}
          </span>
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
        {this.state.mode === 'revisions' && (
          <Revisions doc={this.state.currentLI} />
        )}
        {this.state.mode === 'dashboard' && (
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
                const page = values(toJS(wikistore.pages)).find(
                  x => x.liId === id
                ).title;
                this.props.history.push(`/wiki/${this.wikiId}/${page}`);
                this.setState({ mode: 'document', docMode: 'view' });
              }}
            />
          </Paper>
        )}
        {this.state.mode === 'document' && (
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
                {this.state.currentLI && (
                  <LearningItem
                    type={this.state.docMode}
                    id={this.state.currentLI}
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
