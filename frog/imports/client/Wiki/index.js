// @flow

import * as React from 'react';
import { withRouter } from 'react-router';
import { findKey } from 'lodash';
import Mousetrap from 'mousetrap';
import 'mousetrap/plugins/global-bind/mousetrap-global-bind.min.js';
import { toObject as queryToObject } from 'query-parse';
import { values } from 'frog-utils';

import Button from '@material-ui/core/Button';
import History from '@material-ui/icons/History';
import ChromeReaderMode from '@material-ui/icons/ChromeReaderMode';
import Dashboard from '@material-ui/icons/Dashboard';
import ImportContacts from '@material-ui/icons/ImportContacts';
import Delete from '@material-ui/icons/Delete';
import RestorePage from '@material-ui/icons/RestorePage';

import { connection } from '../App/connection';
import { generateReactiveFn } from '/imports/api/generateReactiveFn';
import LI from '../LearningItem';
import { getPageTitle, getDifferentPageId, checkNewPageTitle } from './helpers';
import {
  invalidateWikiPage,
  changeWikiPageTitle,
  restoreWikiPage,
  changeWikiPageLI,
  createNewEmptyWikiDoc,
  addNewInstancePage
} from '/imports/api/wikiDocHelpers';
import { createNewLI } from './liDocHelpers';

import { wikiStore } from './store';
import CreateModal from './ModalCreate';
import DeletedPageModal from './ModalDeletedPage';
import FindModal, { SearchAndFind } from './ModalFind';
import RestoreModal from './ModalRestore';
import WikiTopNavbar from './components/TopNavbar';
import WikiContentComp from './WikiContentComp';
import { addNewWikiPage } from '../../api/wikiDocHelpers';

import {
  withModalController,
  type ModalParentPropsT
} from './components/Modal';

const genericDoc = connection.get('li');
export const dataFn = generateReactiveFn(genericDoc, LI, {
  createdByUser: Meteor.userId()
});
export const LearningItem = dataFn.LearningItem;

type WikiCompPropsT = {
  location: *,
  match: {
    params: {
      wikiId: string,
      pageTitle: ?string
    }
  },
  history: Object
} & ModalParentPropsT;

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

class WikiComp extends React.Component<WikiCompPropsT, WikiCompStateT> {
  wikiId: string = this.props.match.params.wikiId;

  wikiDoc: Object = {};

  config: Object = {};

  initialLoad: boolean = true;

  wikiContext: Object = {};

  preventRenderUntilNextShareDBUpdate: boolean = false;

  constructor(props) {
    super(props);

    window.wiki = {
      createPage: this.createPage,
      goToPage: this.goToPage,
      openDeletedPageModal: this.openDeletedPageModal
    };

    const query = queryToObject(this.props.location.search.slice(1));

    this.state = {
      pagesData: null,
      dashboardSearch: null,
      pageId: null,
      currentPageObj: null,
      initialPageTitle:
        decodeURIComponent(this.props.match.params.pageTitle) || null,
      mode: 'document',
      docMode: query.edit ? 'edit' : 'view',
      error: null,
      openCreator: false,
      createModalOpen: false,
      search: '',
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

    window.wikiDoc = this.wikiDoc;

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
    const pageTitle = decodeURIComponent(this.props.match.params.pageTitle);

    if (
      (pageTitle !== this.state.currentPageObj?.title &&
        decodeURIComponent(prevProps.match.params.pageTitle) !==
          decodeURIComponent(this.props.match.params.pageTitle)) ||
      prevProps.match.params.instance !== this.props.match.params.instance
    ) {
      this.goToPageTitle(pageTitle, this.props.match.params.instance);
    }
  }

  shouldComponentUpdate() {
    return !this.preventRenderUntilNextShareDBUpdate;
  }

  loadWikiDoc = () => {
    this.preventRenderUntilNextShareDBUpdate = false;

    if (!this.wikiDoc.data) {
      const liId = createNewLI(this.wikiId, 'li-richText');
      return createNewEmptyWikiDoc(this.wikiDoc, this.wikiId, liId);
    }

    wikiStore.setPages(this.wikiDoc.data.pages);
    this.setState({ pagesData: wikiStore.pages });

    if (this.initialLoad) {
      return this.handleInitialLoad();
    }

    if (
      this.state.currentPageObj &&
      wikiStore.pages[this.state.currentPageObj.id].valid
    ) {
      const newPageObj = wikiStore.pages[this.state.currentPageObj.id];
      const currentPageObj = JSON.parse(
        JSON.stringify(this.state.currentPageObj)
      );
      currentPageObj.instances = newPageObj.instances;
      this.setState({
        currentPageObj
      });
      return;
    }

    if (
      this.state.currentPageObj &&
      !wikiStore.pages[this.state.currentPageObj.id].valid
    ) {
      const pageTitle = getPageTitle(wikiStore.parsedPages);
      this.goToPageTitle(pageTitle);
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
      this.createPage(pageTitle, true);
      return;
    }

    const instanceId =
      this.getInstanceIdForName(
        fullPageObj,
        this.props.match.params.instance
      ) || this.getInstanceId(fullPageObj);
    const currentPageObj = this.getProperCurrentPageObj(
      fullPageObj,
      instanceId
    );

    if (!currentPageObj) {
      if (!fullPageObj.noNewInstances) {
        this.initialLoad = true;
        const instanceName = Meteor.user().username;
        this.createNewInstancePage(fullPageObj, instanceId, instanceName);
      }
      return;
    }

    if (!currentPageObj.valid) {
      this.initialLoad = true;
      this.setState({
        currentPageObj,
        deletedPageModalOpen: true,
        currentDeletedPageId: currentPageObj.id,
        currentDeletedPageTitle: currentPageObj.title
      });
      this.openDeletedPageModal(currentPageObj.id, currentPageObj.title);
      return;
    }

    this.setState(
      {
        currentPageObj
      },
      () => {
        const instanceName = this.getInstanceNameForId(fullPageObj, instanceId);
        const link =
          '/wiki/' +
          this.wikiId +
          '/' +
          encodeURIComponent(currentPageObj.title) +
          (instanceId && instanceId !== this.getInstanceId(fullPageObj)
            ? '/' + instanceName
            : '');
        this.props.history.push(link);
      }
    );
  };

  getProperCurrentPageObj = (fullPageObj, instanceId) => {
    if (!fullPageObj || fullPageObj.plane === 3) return fullPageObj;

    const instanceObj = fullPageObj.instances[instanceId];
    if (!instanceObj) return null;

    const mergedObj = Object.assign({}, fullPageObj, instanceObj);
    return mergedObj;
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

  getInstanceNameForId = (pageObj, instanceId) => {
    if (!instanceId || !pageObj || pageObj.plane === 3) return null;

    for (const instanceObj of values(pageObj.instances)) {
      if (instanceObj.instanceId === instanceId)
        return instanceObj.instanceName;
    }

    return null;
  };

  getInstanceIdForName = (pageObj, instanceName) => {
    if (!instanceName || !pageObj || pageObj.plane === 3) return null;

    for (const instanceObj of values(pageObj.instances)) {
      if (instanceObj.instanceName === instanceName)
        return instanceObj.instanceId;
    }

    return null;
  };

  deleteLI = (pageId: string) => {
    const newPageId = getDifferentPageId(wikiStore.pagesArrayOnlyValid, pageId);
    if (!newPageId) throw new Error('Missing new page id');

    this.goToPage(newPageId, () => invalidateWikiPage(this.wikiDoc, pageId));
  };

  createNewInstancePage = async (pageObj, instanceId, instanceName) => {
    const liId = await dataFn.duplicateLI(pageObj.liId);
    addNewInstancePage(
      this.wikiDoc,
      pageObj.id,
      instanceId,
      instanceName,
      liId
    );
    return {
      instanceId,
      liId
    };
  };

  restoreDeletedPage = pageId => {
    restoreWikiPage(this.wikiDoc, pageId);
    this.goToPage(pageId);
  };

  createNewLIForPage = pageId => {
    restoreWikiPage(this.wikiDoc, pageId);
    const newId = createNewLI(this.wikiId, 'li-richText');
    changeWikiPageLI(this.wikiDoc, pageId, newId);
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
      encodeURIComponent(newPageTitle) +
      (instanceId ? '/' + instanceId : '');
    this.props.history.replace(link);
  };

  goToPage = (pageId, cb, side, foreignInstanceId) => {
    const fullPageObj = wikiStore.pages[pageId];
    const instanceId = foreignInstanceId || this.getInstanceId(fullPageObj);
    const newCurrentPageObj = this.getProperCurrentPageObj(
      fullPageObj,
      instanceId
    );

    if (!newCurrentPageObj) {
      if (!fullPageObj.noNewInstances) {
        this.initialLoad = true;
        this.setState(
          {
            initialPageTitle: fullPageObj.title
          },
          () => {
            if (foreignInstanceId) return;
            const instanceName = Meteor.user().username;
            this.preventRenderUntilNextShareDBUpdate = true;
            this.createNewInstancePage(fullPageObj, instanceId, instanceName);
          }
        );
      }
    }
    const currentPageObj =
      !side || side === 'left' ? newCurrentPageObj : this.state.currentPageObj;
    const rightSideCurrentPageObj =
      side === 'right' ? newCurrentPageObj : this.state.rightSideCurrentPageObj;

    const mode =
      this.state.mode === 'splitview' ||
      (this.state.mode !== 'splitview' && side === 'right')
        ? 'splitview'
        : 'document';
    this.setState(
      {
        currentPageObj,
        rightSideCurrentPageObj,
        mode,
        search: '',
        findModalOpen: false,
        createModalOpen: false
      },
      () => {
        if (!newCurrentPageObj || side === 'right') return;

        const instanceName = this.getInstanceNameForId(fullPageObj, instanceId);
        const link =
          '/wiki/' +
          this.wikiId +
          '/' +
          encodeURIComponent(newCurrentPageObj.title) +
          (instanceId && instanceId !== this.getInstanceId(fullPageObj)
            ? '/' + instanceName
            : '');
        if (cb) {
          this.props.history.replace(link);
          return cb();
        }
        this.props.history.push(link);
      }
    );
  };

  goToPageTitle = (pageTitle, instanceName, side) => {
    const pageTitleLower = pageTitle.toLowerCase();
    const pageId = wikiStore.parsedPages[pageTitleLower].id;
    const instanceId = this.getInstanceIdForName(
      wikiStore.parsedPages[pageTitleLower],
      instanceName
    );
    this.goToPage(pageId, null, side, instanceId);
  };

  // Creates a new page entry in ShareDB and navigates to it.
  createPage = (title, socialPlane, activityConfig, operatorConfig) => {
    const error =
      checkNewPageTitle(wikiStore.parsedPages, title) ||
      (activityConfig?.invalid && 'Activity config is not valid') ||
      (operatorConfig?.invalid && 'Operator config is not valid');
    if (error) {
      this.setState({ error });
      return;
    }
    this.preventRenderUntilNextShareDBUpdate = true;
    const liType = activityConfig ? 'li-activity' : 'li-richText';
    const liId = createNewLI(this.wikiId, liType, activityConfig, title);
    const pageId = addNewWikiPage(
      this.wikiDoc,
      title,
      true,
      liType,
      liId,
      socialPlane
    );
    this.goToPage(pageId);
    return { pageId, liId };
  };

  openDeletedPageModal = (pageId, pageTitle) => {
    this.props.showModal(
      <DeletedPageModal
        hideModal={this.props.hideModal}
        onCreateNewPage={() => this.createNewLIForPage(pageId)}
        onRestorePage={() => this.restoreDeletedPage(pageId)}
        pageTitle={pageTitle}
      />
    );
  };

  openRestorePageModal = pages => {
    this.props.showModal(
      <RestoreModal
        pages={pages}
        hideModal={this.props.hideModal}
        onSelect={pageId => this.restoreDeletedPage(pageId)}
      />
    );
  };

  render() {
    if (!this.state.currentPageObj) return null;
    const validPages = wikiStore.pagesArrayOnlyValid;
    const invalidPages = wikiStore.pagesArrayOnlyInvalid;

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

    const primaryNavItems = [
      {
        active: this.state.mode === 'document',
        title: 'Page',
        icon: ChromeReaderMode,
        callback: () => this.changeMode('document')
      },
      {
        active: this.state.mode === 'revisions',
        title: 'Revisions',
        icon: History,
        callback: () => this.changeMode('revisions')
      },
      {
        active: this.state.mode === 'dashboard',
        title: 'All Pages',
        icon: Dashboard,
        callback: () => this.changeMode('dashboard')
      },
      {
        active: this.state.mode === 'splitview',
        title: 'Split View',
        icon: ImportContacts,
        callback: () => this.changeMode('splitview')
      }
    ];

    // Add the delete button to the navigation if applicable
    if (validPages.length > 1) {
      primaryNavItems.push({
        title: 'Delete Page',
        icon: Delete,
        callback: () => this.deleteLI(this.state.currentPageObj.id)
      });
    }

    const secondaryNavItems = [
      {
        title: 'Restore deleted page',
        icon: RestorePage,
        callback: () => this.openRestorePageModal(invalidPages)
      }
    ];

    const instancesList =
      this.state.currentPageObj.plane === 3
        ? null
        : values(this.state.currentPageObj.instances).map(instanceObj => {
            const line = '- /' + instanceObj.instanceName;
            const pageId = this.state.currentPageObj.id;
            const instanceId = instanceObj.instanceId;
            const style = {
              cursor: 'pointer',
              fontWeight:
                this.state.currentPageObj.instanceId === instanceId
                  ? 'bold'
                  : 'normal'
            };
            return (
              <li
                key={instanceId}
                onClick={() => this.goToPage(pageId, null, null, instanceId)}
                style={style}
              >
                {line}
              </li>
            );
          });

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
        {!instancesList ? null : (
          <div style={{ paddingTop: '10px' }}>
            <b>Instances</b>
            <ul>{instancesList}</ul>
          </div>
        )}
      </div>
    );
    return (
      <div>
        <div style={containerDivStyle}>
          {sideNavBar}
          <div style={contentDivStyle}>
            <WikiTopNavbar
              username={Meteor.user().username}
              isAnonymous={Meteor.user().isAnonymous}
              primaryNavItems={primaryNavItems}
              secondaryNavItems={secondaryNavItems}
            />
            <div style={wikiPagesDivContainerStyle}>
              <WikiContentComp
                wikiId={this.wikiId}
                wikiDoc={this.wikiDoc}
                currentPageObj={this.state.currentPageObj}
                mode={this.state.mode}
                changeMode={this.changeMode}
                changeTitle={this.changeTitle}
                openDeletedPageModal={this.openDeletedPageModal}
                goToPage={this.goToPage}
                dashboardSearch={this.state.dashboardSearch}
                side={this.state.mode === 'splitview' ? 'left' : null}
              />
              {this.state.mode === 'splitview' && (
                <WikiContentComp
                  wikiId={this.wikiId}
                  wikiDoc={this.wikiDoc}
                  currentPageObj={this.state.rightSideCurrentPageObj}
                  mode={this.state.mode}
                  changeMode={this.changeMode}
                  changeTitle={this.changeTitle}
                  openDeletedPageModal={this.openDeletedPageModal}
                  goToPage={this.goToPage}
                  dashboardSearch={this.state.dashboardSearch}
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
            onCreate={this.createPage}
            setModalOpen={e => this.setState({ createModalOpen: e })}
            clearError={() => this.setState({ error: null })}
            errorDiv={this.state.error}
            wikiId={this.wikiId}
          />
        )}
      </div>
    );
  }
}

const Wiki = withRouter(withModalController(WikiComp));
Wiki.displayName = 'Wiki';

export default Wiki;
