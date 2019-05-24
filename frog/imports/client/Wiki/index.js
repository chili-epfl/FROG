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
  getPageTitle,
  checkNewPageTitle
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
  completelyDeleteWikiPage,
  addNewGlobalWikiPage
} from '/imports/api/wikiDocHelpers';
import { createNewGenericLI } from './liDocHelpers';

import { wikiStore } from './store';
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
  mode: string,
  error: ?string,
  openCreator: ?Object,
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

  initialLoad: boolean = true;

  wikiContext: Object = {};

  constructor(props) {
    super(props);

    const query = queryToObject(this.props.location.search.slice(1));

    this.wikiContext = {
      getWikiId: this.getWikiId,
      getOnlyValidWikiPages: () =>
        wikiStore.getPagesArrayOnlyValidExcludingCurrent()
    };

    window.wiki = {
      createNewGenericPage: this.createNewGenericPage
    };

    this.state = {
      pagesData: null,
      dashboardSearch: null,
      pageId: null,
      initialPageTitle: this.props.match.params.pageTitle || null,
      urlInstance: this.props.match.params.instance || null,
      mode: 'document',
      docMode: query.edit ? 'edit' : 'view',
      error: null,
      openCreator: false,
      createModalOpen: false,
      search: '',
      deletedPageModalOpen: false,
      currentDeletedPageId: null,
      currentDeletedPageTitle: null
    };
  }

  componentDidMount() {
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
    if (!this.wikiDoc.data) {
      const liId = createNewGenericLI(this.wikiId);
      return createNewEmptyWikiDoc(this.wikiDoc, this.wikiId, liId);
    }

    wikiStore.setPages(this.wikiDoc.data.pages);
    this.setState({ pagesData: wikiStore.pages });

    if (this.initialLoad) {
      return this.handleInitialLoad();
    }
  };

  handleInitialLoad = () => {
    const parsedPages = wikiStore.parsedPages;
    this.initialLoad = false;
    const pageTitle = getPageTitle(parsedPages, this.state.initialPageTitle);
    const pageTitleLower = pageTitle.toLowerCase();
    const page = parsedPages[pageTitleLower];
    const pageId = page.id;

    if (!page) {
      this.initialLoad = true;
      return this.createNewGenericPage(pageTitle, true);
    }
    if (!page.valid)
      return this.setState({
        deletedPageModalOpen: true,
        currentDeletedPageId: pageId,
        currentDeletedPageTitle: pageTitle
      });

    this.setState({
      currentPageObj: page
    });
  };

  getWikiId = () => {
    return this.wikiId;
  };

  deleteLI = (pageId: string) => {
    const parsedPages = wikiStore.parsedPages;
    const newPageId = getPageTitle(parsedPages, null, pageId);
    if (!newPageId) throw new Error('Missing new page id');

    this.goToPage(newPageId, () => invalidateWikiPage(this.wikiDoc, pageId));
  };

  createNewGenericPage = (pageTitle, setCreated) => {
    const liId = createNewGenericLI(this.wikiId);
    const pageId = addNewGlobalWikiPage(
      this.wikiDoc,
      pageTitle,
      liId,
      setCreated,
      'li-richText'
    );

    return {
      pageId,
      liId
    };
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

  openDeletedPageModal = (pageId, pageTitle) => {
    this.setState({
      deletedPageModalOpen: true,
      currentDeletedPageId: pageId,
      currentDeletedPageTitle: pageTitle
    });
  };

  removeDeletedPageModal = () => {
    const pageId = this.state.currentDeletedPageId;
    this.goToPage(pageId);
  };

  changeMode = mode => {
    this.setState({
      mode
    });
  };

  changeTitle = (pageId, newPageTitle) => {
    changeWikiPageTitle(this.wikiDoc, pageId, newPageTitle);
    // TODO: Change Window URL
  };

  goToPage = (pageId, cb) => {
    const pageObj = wikiStore.pages[pageId];
    this.setState(
      {
        currentPageObj: pageObj,
        deletedPageModalOpen: false,
        currentDeletedPageId: null,
        currentDeletedPageTitle: null,
        mode: 'document'
      },
      () => {
        const link = '/wiki/' + this.wikiId + '/' + pageObj.title;
        if (cb) {
          this.props.history.replace(link);
          return cb();
        }
        this.props.history.push(link);
      }
    );
  };

  render() {
    // console.log(this.state);
    // if (
    //   !this.state.page?.noNewInstances &&
    //   (!this.state.page || !this.state.pageTitle || !this.state.currentLI)
    // )
    //   return null;

    const validPages = wikiStore.pagesArrayOnlyValid;

    let foundPages = validPages;
    if (this.state.search !== '') {
      const search = this.state.search.trim().toLowerCase();
      foundPages = validPages.filter(x =>
        x.title.toLowerCase().includes(search)
      );
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

    const onSelect = pageTitle => {
      const pageTitleLower = pageTitle.toLowerCase();
      const pageId = wikiStore.parsedPages[pageTitleLower].id;
      this.goToPage(pageId);
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
            key={this.state.currentPageObj?.id}
            pages={foundPages}
            currentPage={this.state.currentPageObj?.id}
            // currentInstance={this.getInstanceName(this.state.page)}
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
        <WikiContext.Provider value={this.wikiContext}>
          <div style={containerDivStyle}>
            {sideNavBar}
            <div style={contentDivStyle}>
              <WikiTopNavbar
                currentPageObj={this.state.currentPageObj}
                deleteLI={this.deleteLI}
                changeMode={this.changeMode}
                moreThanOnePage={validPages > 1}
              />
              <WikiContentComp
                wikiDoc={this.wikiDoc}
                currentPageObj={this.state.currentPageObj}
                currentLI={this.state.currentLI}
                mode={this.state.mode}
                changeMode={this.changeMode}
                changeTitle={this.changeTitle}
                openDeletedPageModal={this.openDeletedPageModal}
                goToPage={this.goToPage}
              />
            </div>
          </div>
          {this.state.findModalOpen && (
            <FindModal
              history={this.props.history}
              setModalOpen={e => this.setState({ findModalOpen: e })}
              wikiId={this.wikiId}
              onSelect={onSelect}
              pages={validPages}
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
