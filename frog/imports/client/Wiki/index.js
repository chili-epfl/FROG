// @flow

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { WikiContext, values, uuid } from 'frog-utils';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { findKey, flatMap } from 'lodash';
import Mousetrap from 'mousetrap';
import 'mousetrap/plugins/global-bind/mousetrap-global-bind.min.js';
import { toObject as queryToObject } from 'query-parse';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { connection } from '../App/connection';
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
  changeWikiPageLI,
  createNewEmptyWikiDoc,
  completelyDeleteWikiPage
} from '/imports/api/wikiDocHelpers';
import { createNewGenericLI } from './liDocHelpers';

import { wikistore } from './store';
import LIDashboard from '../Dashboard/LIDashboard';
import Revisions from './Revisions';
import CreateModal from './ModalCreate';
import DeletedPageModal from './ModalDeletedPage';
import FindModal, { SearchAndFind } from './ModalFind';
import WikiTopNavbar from './WikiTopNavbar';
import WikiContentComp from './WikiContentComp';

type WikiCompPropsT = {
  location: *,
  match: {
    params: {
      wikiId: string,
      pageTitle: ?string
    }
  },
  history: Object
};

type WikiCompStateT = {
  dashboardSearch: ?string,
  pageTitle: ?string,
  page: ?Object,
  pageTitleString: ?string,
  mode: string,
  docMode: string,
  currentLI?: string | Object,
  editingTitle: boolean,
  error: ?string,
  openCreator: ?Object,
  showTitleEditButton: boolean,
  wikiContext: Object,
  createModalOpen: boolean,
  findModalOpen: boolean,
  search: '',
  urlInstance: ?string,
  noInstance: ?boolean
};

class WikiComp extends Component<WikiCompPropsT, WikiCompStateT> {
  wikiId: string = this.props.match.params.wikiId;

  wikiDoc: Object = {};

  config: Object = {};

  initialLoad: boolean = false;

  constructor(props) {
    super(props);

    const query = queryToObject(this.props.location.search.slice(1));
    this.state = {
      dashboardSearch: null,
      pageId: null,
      pageTitle: this.props.match.params.pageTitle || null,
      urlInstance: this.props.match.params.instance || null,
      mode: 'document',
      docMode: query.edit ? 'edit' : 'view',
      error: null,
      openCreator: false,
      createModalOpen: false,
      search: '',
      deletedPageModalOpen: false,
      currentDeletedPageId: null,
      currentDeletedPageTitle: null,
      wikiContext: {
        getWikiId: this.getWikiId,
        getWikiPages: this.getWikiPages,
        getOnlyValidWikiPages: this.getOnlyValidWikiPages
      }
    };
  }

  componentDidMount() {
    window.wiki = {
      WikiLink: this.WikiLink,
      createPage: this.createNewPageLI
    };
    this.wikiDoc = connection.get('wiki', this.wikiId);
    this.wikiDoc.on('create', () => {
      this.loadWikiDoc();
    });
    this.wikiDoc.on('op', () => {
      this.loadWikiDoc();
    });
    this.wikiDoc.on('error', err => {
      throw err;
    });
    this.wikiDoc.subscribe(err => {
      if (err) throw err;
      this.loadWikiDoc();
    });

    Mousetrap.bindGlobal('ctrl+n', () =>
      this.setState({ createModalOpen: true })
    );
    Mousetrap.bindGlobal('ctrl+s', () => this.setState({ docMode: 'view' }));
    Mousetrap.bindGlobal('ctrl+e', () => this.setState({ docMode: 'edit' }));
    Mousetrap.bindGlobal('ctrl+f', () =>
      this.setState({ findModalOpen: true })
    );
  }

  loadWikiDoc = () => {
    if (!this.wikiDoc.data)
      return createNewEmptyWikiDoc(this.wikiDoc, this.wikiId);

    wikistore.setPages(this.wikiDoc.data.pages);

    if (this.initialLoad) {
      const parsedPages = parseDocResults(this.wikiDoc.data);
      return this.handleInitialLoad(parsedPages);
    }
  };

  handleInitialLoad = parsedPages => {
    this.initialLoad = false;
    const pageTitle = getPageTitle(parsedPages, this.state.pageTitle);
    const pageTitleLower = pageTitle.toLowerCase();
    const page = parsedPages[pageTitleLower];
    const pageId = page.id;

    if (!page) {
      this.initialLoad = true;
      const liId = createNewGenericLI(this.wikiId);
      return addNewWikiPage(this.wikiDoc, liId, pageTitle, true, 'li-richText');
    }
    if (!page.valid)
      return this.setState({
        deletedPageModalOpen: true,
        currentDeletedPageId: pageId,
        currentDeletedPageTitle: pageTitle
      });

    this.setState({
      pageId,
      pageTitle,
      currentLi: page.liId
    });
  };

  getWikiId = () => {
    return this.wikiId;
  };

  getWikiPages = () => {
    return flatMap(values(wikistore.pages), pageObj =>
      parsePageObjForReactiveRichText(this.wikiId, pageObj)
    );
  };

  getOnlyValidWikiPages = (
    includeCurrentPage: boolean,
    alsoInstances: boolean
  ) => {
    const p = flatMap(
      values(wikistore.pages).filter(
        x =>
          x.valid &&
          x.created &&
          (includeCurrentPage || x.title !== this.state.pageTitle)
      ),
      pageObj =>
        parsePageObjForReactiveRichText(this.wikiId, pageObj, alsoInstances)
    );
    return p;
  };

  createLI = (newTitle, liType = 'li-richText', li, config, p1) => {
    const parsedPages = parseDocResults(this.wikiDoc.data);
    const error = checkNewPageTitle(parsedPages, newTitle);
    if (error)
      return this.setState({
        error
      });

    const newTitleLower = newTitle.toLowerCase();

    if (parsedPages[newTitleLower]) {
      completelyDeleteWikiPage(this.wikiDoc, parsedPages[newTitleLower].id);
    }

    if (li) {
      addNewWikiPage(this.wikiDoc, newTitle, true, liType);
    } else if (config && config.activityType) {
      this.createActivityPage(newTitle, config);
    } else {
      addNewWikiPage(
        this.wikiDoc,
        newTitle,
        true,
        liType || 'li-richText',
        p1 ? 1 : 3
      );
    }

    this.setState(
      {
        newTitle: '',
        error: null
      },
      () => {
        const link = '/wiki/' + this.wikiId + '/' + newTitle + '?edit=true';
        this.props.history.push(link);
      }
    );
  };

  deleteLI = (pageId: string) => {
    const parsedPages = parseDocResults(this.wikiDoc.data);
    const newPageId = getPageTitle(parsedPages, null, pageId);
    if (!newPageId) throw new Error('Missing new page id');

    const newPageTitle = parsedPages[pageId].title;
    this.setState(
      {
        pageId: newPageId,
        pageTitle: newPageTitle
      },
      () => {
        invalidateWikiPage(this.wikiDoc, pageId);
        const link = '/wiki/' + this.wikiId + '/' + newPageTitle;
        this.props.history.replace(link);
      }
    );
  };

  restoreDeletedPage = pageId => {
    restoreWikiPage(this.wikiDoc, pageId);
    this.removeDeletedPageModal();
  };

  createNewLIForPage = pageId => {
    restoreWikiPage(this.wikiDoc, pageId);
    const newId = createNewGenericLI(this.wikiId);
    changeWikiPageLI(this.wikiDoc, pageId, newId);
    this.removeDeletedPageModal();
  };

  removeDeletedPageModal = () => {
    const pageTitle = this.state.currentDeletedPageTitle;
    this.setState(
      {
        deletedPageModalOpen: false,
        currentDeletedPageId: null,
        currentDeletedPageTitle: null
      },
      () => {
        const link = '/wiki/' + this.wikiId + '/' + pageTitle;
        this.props.history.push(link);
      }
    );
  };

  render() {
    if (
      !this.state.page?.noNewInstances &&
      (!this.state.page || !this.state.pageTitle || !this.state.currentLI)
    )
      return null;

    const validPages = this.getOnlyValidWikiPages();
    const validPagesIncludingCurrent = this.getOnlyValidWikiPages(true, true);

    let pages = validPagesIncludingCurrent;
    if (this.state.search !== '') {
      const search = this.state.search.trim().toLowerCase();
      pages = validPages.filter(x => x.title.toLowerCase().includes(search));
    }

    const containerDivStyle = {
      display: 'flex',
      height: '100vh',
      width: '100%'
    };

    const sideNavBarStyle = {
      width: '250px',
      backgroundColor: 'white',
      overflowX: 'hidden',
      overflowY: 'auto',
      padding: '10px',
      borderRight: '1px lightgrey solid'
    };

    const contentDivStyle = {
      flex: 'auto',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: 'calc(100vw - 250px)'
    };

    const onSelect = id => {
      const link = '/wiki/' + this.wikiId + '/' + id;
      this.props.history.push(link);
    };

    const sideNavBar = (
      <div style={sideNavBarStyle}>
        <h2>{this.wikiId}</h2>
        <ul>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.setState({ createModalOpen: true })}
          >
            + Create new page
          </Button>
          <SearchAndFind
            key={this.state.pageId}
            pages={pages}
            currentPage={this.state.page?.id}
            currentInstance={this.getInstanceName(this.state.page)}
            onSearch={e =>
              this.setState({
                findModalOpen: false,
                dashboardSearch: e,
                mode: 'dashboard'
              })
            }
            onSelect={onSelect}
          />
        </ul>
      </div>
    );

    return (
      <div>
        <WikiContext.Provider value={this.state.wikiContext}>
          <div style={containerDivStyle}>
            {sideNavBar}
            <div style={contentDivStyle}>
              {WikiTopNavbar}
              <WikiContentComp />
            </div>
          </div>
          {this.state.findModalOpen && (
            <FindModal
              history={this.props.history}
              setModalOpen={e => this.setState({ findModalOpen: e })}
              wikiId={this.wikiId}
              onSelect={onSelect}
              pages={this.getOnlyValidWikiPages().filter(
                x => x.id !== this.state.pageId
              )}
              errorDiv={this.state.error}
              onSearch={e =>
                this.setState({
                  findModalOpen: false,
                  dashboardSearch: e,
                  mode: 'dashboard'
                })
              }
            />
          )}
          {this.state.createModalOpen && (
            <CreateModal
              onCreate={this.createLI}
              setModalOpen={e => this.setState({ createModalOpen: e })}
              errorDiv={this.state.error}
              wikiId={this.wikiId}
            />
          )}
          {this.state.deletedPageModalOpen && (
            <DeletedPageModal
              closeModal={() => this.setState({ deletedPageModalOpen: false })}
              restoreDeletedPage={this.restoreDeletedPage}
              createNewLIForPage={this.createNewLIForPage}
              pageId={this.state.currentDeletedPageId}
              pageTitle={this.state.currentDeletedPageTitle}
            />
          )}
        </WikiContext.Provider>
      </div>
    );
  }
}

const Wiki = withRouter(WikiComp);
Wiki.displayName = 'Wiki';

export default Wiki;
