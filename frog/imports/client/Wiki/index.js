// @flow

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { findKey } from 'lodash';
import Mousetrap from 'mousetrap';
import 'mousetrap/plugins/global-bind/mousetrap-global-bind.min.js';
import { toObject as queryToObject } from 'query-parse';
import { values, uuid } from 'frog-utils';
import { activityTypesObj } from '/imports/activityTypes';

import Button from '@material-ui/core/Button';

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
  addNewGlobalWikiPage,
  addNewInstancePage,
  addNewWikiPageWithInstances
} from '/imports/api/wikiDocHelpers';
import { createNewGenericLI } from './liDocHelpers';

import { wikiStore } from './store';
import CreateModal from './ModalCreate';
import DeletedPageModal from './ModalDeletedPage';
import FindModal, { SearchAndFind } from './ModalFind';
import RestoreModal from './ModalRestore';
import WikiTopNavbar from './WikiTopNavbar';
import WikiContentComp from './WikiContentComp';

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
};

type WikiCompStateT = {
  dashboardSearch: ?string,
  mode: string,
  error: ?string,
  openCreator: ?Object,
  createModalOpen: boolean,
  findModalOpen: boolean,
  restoreModalOpen: boolean,
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

    window.wiki = {
      createNewGenericPage: this.createNewGenericPage,
      goToPage: this.goToPage,
      openDeletedPageModal: this.openDeletedPageModal
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
      restoreModalOpen: false,
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
    const pageTitle = this.props.match.params.pageTitle;
    if (
      (pageTitle !== this.state.currentPageObj?.title &&
        prevProps.match.params.pageTitle !==
          this.props.match.params.pageTitle) ||
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
      const liId = createNewGenericLI(this.wikiId);
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
      this.createNewGenericPage(pageTitle, true);
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
          currentPageObj.title +
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

  createNewGenericPage = (pageTitle, setCreated, rawconfig) => {
    let liId;
    if (rawconfig && rawconfig.activityType) {
      const { activityType, config } = rawconfig;
      const id = uuid();
      const doc = connection.get('rz', id + '/all');
      doc.create(activityTypesObj[activityType].dataStructure);
      const payload = {
        acType: activityType,
        activityData: { config },
        rz: id + '/all',
        title: pageTitle,
        activityTypeTitle: activityTypesObj[activityType].meta.name
      };

      liId = createNewGenericLI(this.wikiId, payload);
    } else liId = createNewGenericLI(this.wikiId);
    console.log(rawconfig);
    const pageId = addNewGlobalWikiPage(
      this.wikiDoc,
      pageTitle,
      liId,
      setCreated,
      rawconfig && rawconfig.activityType ? 'li-activity' : 'li-richText'
    );

    return {
      pageId,
      liId
    };
  };

  createNewInstancePage = (pageObj, instanceId, instanceName) => {
    // TODO: Handle creating different LI types and activities
    const liId = createNewGenericLI(this.wikiId);
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
            this.createNewInstancePage(fullPageObj, instanceId, instanceName);
          }
        );

        return;
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
        deletedPageModalOpen: false,
        currentDeletedPageId: null,
        currentDeletedPageTitle: null,
        mode,
        search: '',
        findModalOpen: false,
        createModalOpen: false,
        restoreModalOpen: false
      },
      () => {
        if (!newCurrentPageObj || side === 'right') return;

        const instanceName = this.getInstanceNameForId(fullPageObj, instanceId);
        const link =
          '/wiki/' +
          this.wikiId +
          '/' +
          newCurrentPageObj.title +
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

  createLI = (newTitle, plane, rawconfig, operatorConfig) => {
    console.log(rawconfig);
    const error =
      checkNewPageTitle(wikiStore.parsedPages, newTitle) ||
      (rawconfig.invalid && 'Activity config is not valid') ||
      (operatorConfig.invalid && 'Operator config is not valid');
    if (error) {
      this.setState({ error });
      return;
    }

    this.preventRenderUntilNextShareDBUpdate = true;
    // TODO: Rewrite this function to propely handle creating different types of activities/LIs

    let pageId;
    if (plane === 3) {
      const ids = this.createNewGenericPage(newTitle, true, rawconfig);
      pageId = ids.pageId;
    } else {
      const liType =
        rawconfig && rawconfig.activityType ? 'li-activity' : 'li-richText';
      let liId;
      if (rawconfig && rawconfig.activityType) {
        const { activityType, config } = rawconfig;
        const id = uuid();
        const doc = connection.get('rz', id + '/all');
        doc.create(activityTypesObj[activityType].dataStructure);
        const payload = {
          acType: activityType,
          activityData: { config },
          rz: id + '/all',
          title: newTitle,
          activityTypeTitle: activityTypesObj[activityType].meta.name
        };

        liId = createNewGenericLI(this.wikiId, payload);
      } else liId = createNewGenericLI(this.wikiId);
      // TODO: Below instance ID should be found differently for groups
      const instanceId = Meteor.userId();
      const instanceName = Meteor.user().username;

      pageId = addNewWikiPageWithInstances(
        this.wikiDoc,
        plane,
        newTitle,
        liType,
        instanceId,
        instanceName,
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
              currentPageObj={this.state.currentPageObj}
              deleteLI={this.deleteLI}
              mode={this.state.mode}
              changeMode={this.changeMode}
              moreThanOnePage={validPages.length > 1}
              openRestoreModal={() => this.setState({ restoreModalOpen: true })}
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
        {this.state.restoreModalOpen && (
          <RestoreModal
            pages={invalidPages}
            setModalOpen={e => this.setState({ restoreModalOpen: e })}
            onSelect={(pageId, pageTitle) =>
              this.openDeletedPageModal(pageId, pageTitle)
            }
          />
        )}
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
      </div>
    );
  }
}

const Wiki = withRouter(WikiComp);
Wiki.displayName = 'Wiki';

export default Wiki;
