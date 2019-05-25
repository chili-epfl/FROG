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

import { connection } from '../App/connection';
import { getPageTitle, checkNewPageTitle, getDifferentPageId } from './helpers';
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
  addNewGlobalWikiPage,
  addNewInstancePage,
  addNewWikiPageWithInstances
} from '/imports/api/wikiDocHelpers';
import { createNewGenericLI } from './liDocHelpers';

import { wikiStore } from './store';
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

  preventRenderUntilNextShareDBUpdate: boolean = false;

  constructor(props) {
    super(props);

    this.wikiContext = {
      getWikiId: this.getWikiId,
      getOnlyValidWikiPages: () =>
        this.state.mode === 'splitview'
          ? wikiStore.pagesArrayOnlyValid
          : wikiStore.pagesArrayOnlyValid.filter(
              x => x.id !== this.state.currentPageObj?.id
            )
    };

    window.wiki = {
      createNewGenericPage: this.createNewGenericPage
    };

    const query = queryToObject(this.props.location.search.slice(1));

    this.state = {
      pagesData: null,
      dashboardSearch: null,
      pageId: null,
      currentPageObj: null,
      initialPageTitle: this.props.match.params.pageTitle || null,
      mode: 'document',
      docMode: query.edit ? 'edit' : 'view',
      error: null,
      openCreator: false,
      createModalOpen: false,
      search: '',
      deletedPageModalOpen: false,
      currentDeletedPageId: null,
      currentDeletedPageTitle: null,
      rightSideCurrentPageObj: null
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

  componentDidUpdate(prevProps) {
    const pageTitle = this.props.match.params.pageTitle;
    if (
      (pageTitle !== this.state.currentPageObj?.title &&
        prevProps.match.params.pageTitle !==
          this.props.match.params.pageTitle) ||
      prevProps.match.params.instance !== this.props.match.params.instance
    ) {
      this.goToPageTitle(pageTitle);
    }
  }

  shouldComponentUpdate() {
    return !this.preventRenderUntilNextShareDBUpdate;
  }

  loadWikiDoc = () => {
    this.preventRenderUntilNextShareDBUpdate = false;

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
    this.initialLoad = false;
    const parsedPages = wikiStore.parsedPages;
    const pageTitle = getPageTitle(parsedPages, this.state.initialPageTitle);
    const pageTitleLower = pageTitle.toLowerCase();
    const fullPageObj = parsedPages[pageTitleLower];

    if (!fullPageObj) {
      this.initialLoad = true;
      this.createNewGenericPage(pageTitle, true);
      return;
    }

    const instanceId =
      this.props.match.params.instance || this.getInstanceId(fullPageObj);
    const currentPageObj = this.getProperCurrentPageObj(
      fullPageObj,
      instanceId
    );

    if (!currentPageObj) {
      if (!fullPageObj.noNewInstances) {
        this.initialLoad = true;
        this.createNewInstancePage(fullPageObj, instanceId);
        return;
      }
    }

    if (!currentPageObj.valid)
      return this.setState({
        deletedPageModalOpen: true,
        currentDeletedPageId: currentPageObj.id,
        currentDeletedPageTitle: pageTitle
      });

    this.setState({
      currentPageObj
    });
  };

  getProperCurrentPageObj = (fullPageObj, instanceId) => {
    if (!fullPageObj || fullPageObj.plane === 3) return fullPageObj;

    return (
      fullPageObj.instances[instanceId] &&
      Object.assign(fullPageObj, fullPageObj.instances[instanceId])
    );
  };

  getInstanceId = pageObj => {
    if (!pageObj || pageObj.plane === 3) return null;

    const userId = Meteor.userId();
    if (pageObj.plane === 2) {
      const group = findKey(pageObj.socialStructure, x => x.includes(userId));
      return group || userId;
    }
    return userId;
  };

  getWikiId = () => {
    return this.wikiId;
  };

  deleteLI = (pageId: string) => {
    const newPageId = getDifferentPageId(wikiStore.pagesArrayOnlyValid, pageId);
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

  createNewInstancePage = (pageObj, instanceId) => {
    // TODO: Handle creating different LI types and activities
    const liId = createNewGenericLI(this.wikiId);
    addNewInstancePage(this.wikiDoc, pageObj.id, instanceId, liId);
    return {
      instanceId,
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
      mode,
      rightSideCurrentPageObj:
        mode === 'splitview' ? this.state.currentPageObj : null
    });
  };

  changeTitle = (pageId, newPageTitle) => {
    changeWikiPageTitle(this.wikiDoc, pageId, newPageTitle);
    const instanceId = this.props.match.params.instance;
    const link =
      '/wiki/' +
      this.wikiId +
      '/' +
      newPageTitle +
      (instanceId ? '/' + instanceId : '');
    this.props.history.replace(link);
  };

  goToPage = (pageId, cb, side) => {
    const fullPageObj = wikiStore.pages[pageId];
    const instanceId = this.getInstanceId(fullPageObj);
    const newCurrentPageObj = this.getProperCurrentPageObj(
      fullPageObj,
      instanceId
    );

    const currentPageObj =
      !side || side === 'left' ? newCurrentPageObj : this.state.currentPageObj;
    const rightSideCurrentPageObj =
      side === 'right' ? newCurrentPageObj : this.state.rightSideCurrentPageObj;

    this.setState(
      {
        currentPageObj,
        rightSideCurrentPageObj,
        deletedPageModalOpen: false,
        currentDeletedPageId: null,
        currentDeletedPageTitle: null,
        mode: this.state.mode === 'splitview' ? 'splitview' : 'document',
        search: '',
        findModalOpen: false,
        createModalOpen: false
      },
      () => {
        if (!newCurrentPageObj || side === 'right') return;

        const link =
          '/wiki/' +
          this.wikiId +
          '/' +
          newCurrentPageObj.title +
          (instanceId ? '/' + instanceId : '');
        if (cb) {
          this.props.history.replace(link);
          return cb();
        }
        this.props.history.push(link);
      }
    );
  };

  goToPageTitle = pageTitle => {
    const pageTitleLower = pageTitle.toLowerCase();
    const pageId = wikiStore.parsedPages[pageTitleLower].id;
    this.goToPage(pageId);
  };

  createLI = (newTitle, plane) => {
    this.preventRenderUntilNextShareDBUpdate = true;
    // TODO: Rewrite this function to propely handle creating different types of activities/LIs

    let pageId;
    if (plane === 3) {
      const ids = this.createNewGenericPage(newTitle, true);
      pageId = ids.pageId;
    } else {
      const liType = 'li-richText';
      const liId = createNewGenericLI(this.wikiId);
      // TODO: Below instance ID should be found differently for groups
      const instanceId = Meteor.userId();

      pageId = addNewWikiPageWithInstances(
        this.wikiDoc,
        plane,
        newTitle,
        liType,
        instanceId,
        liId
      );
    }

    this.goToPage(pageId);
    // setTimeout(() => {
    //   this.goToPage(pageId);
    // }, 100);
  };

  render() {
    if (!this.state.currentPageObj) return null;

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

    const wikiPagesDivContainerStyle = {
      height: 'calc(100vh - 54px)'
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
            onSelect={this.goToPageTitle}
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
                mode={this.state.mode}
                changeMode={this.changeMode}
                moreThanOnePage={validPages.length > 1}
              />
              <div style={wikiPagesDivContainerStyle}>
                <WikiContentComp
                  wikiDoc={this.wikiDoc}
                  currentPageObj={this.state.currentPageObj}
                  mode={this.state.mode}
                  changeMode={this.changeMode}
                  changeTitle={this.changeTitle}
                  openDeletedPageModal={this.openDeletedPageModal}
                  goToPage={this.goToPage}
                  side={this.state.mode === 'splitview' ? 'left' : null}
                />
                {this.state.mode === 'splitview' && (
                  <WikiContentComp
                    wikiDoc={this.wikiDoc}
                    currentPageObj={this.state.rightSideCurrentPageObj}
                    mode={this.state.mode}
                    changeMode={this.changeMode}
                    changeTitle={this.changeTitle}
                    openDeletedPageModal={this.openDeletedPageModal}
                    goToPage={this.goToPage}
                    side="right"
                  />
                )}
              </div>
            </div>
          </div>
          {this.state.findModalOpen && (
            <FindModal
              history={this.props.history}
              setModalOpen={e => this.setState({ findModalOpen: e })}
              wikiId={this.wikiId}
              onSelect={this.goToPageTitle}
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
