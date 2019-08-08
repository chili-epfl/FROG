// @flow

import * as React from 'react';
import { findKey } from 'lodash';
import Mousetrap from 'mousetrap';
import { Meteor } from 'meteor/meteor';
import 'mousetrap/plugins/global-bind/mousetrap-global-bind.min.js';
import { values, entries } from '/imports/frog-utils';
import { withModal, type ModalParentPropsT } from '/imports/ui/Modal';
import { getUsername, getUserType } from '/imports/api/users';
import Button from '@material-ui/core/Button';
import History from '@material-ui/icons/History';
import ChromeReaderMode from '@material-ui/icons/ChromeReaderMode';
import Dashboard from '@material-ui/icons/Dashboard';
import ImportContacts from '@material-ui/icons/ImportContacts';
import Delete from '@material-ui/icons/Delete';
import RestorePage from '@material-ui/icons/RestorePage';
import Tune from '@material-ui/icons/Tune';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import AccountModal from '/imports/client/AccountModal/AccountModal';
import SettingsApplications from '@material-ui/icons/SettingsApplications';
import { connection } from '../App/connection';
import {
  getPageTitle,
  getDifferentPageId,
  checkNewPageTitle,
  sanitizeTitle
} from './helpers';
import {
  invalidateWikiPage,
  changeWikiPageTitle,
  restoreWikiPage,
  changeWikiPageLI,
  createNewEmptyWikiDoc,
  addNewInstancePage,
  addUser,
  addEditor,
  updateSettings,
  updatePageSettings,
  upgradeWikiWithoutSettings
} from '/imports/api/wikiDocHelpers';
import { createNewLI } from './liDocHelpers';

import { wikiStore } from './store';
import PageSettings from './ModalPageSettings';
import DeletedPageModal from './ModalDeletedPage';
import LockedModal from './ModalLocked';
import FindModal, { SearchAndFind } from './ModalFind';
import RestoreModal from './ModalRestore';
import PasswordModal from './ModalPassword';
import ChangePasswordModal from '/imports/client/AccountModal/ChangePasswordModal';
import PermissionsModal from './ModalSettings';
import AlertModal from './ModalAlert';
import WikiTopNavbar from './components/TopNavbar';
import WikiContentComp from './WikiContentComp';
import { addNewWikiPage } from '../../api/wikiDocHelpers';
import { dataFn } from './wikiLearningItem';
import {
  type PageObjT,
  type WikiSettingsT,
  KEY_ENTER,
  PERM_ALLOW_EVERYTHING,
  PERM_PASSWORD_TO_EDIT,
  PERM_PASSWORD_TO_VIEW,
  PRIVILEGE_OWNER,
  PRIVILEGE_EDIT,
  PRIVILEGE_VIEW,
  PRIVILEGE_NONE
} from '/imports/api/wikiTypes';

type WikiCompPropsT = {
  setPage?: (pageobj: PageObjT, replace: boolean) => void,
  pageObj: PageObjT,
  embed?: boolean,
  query?: Object
} & ModalParentPropsT;

type WikiCompStateT = {
  dashboardSearch: ?string,
  mode: string,
  error: ?string,
  openCreator: ?Object,
  findModalOpen: boolean,
  search: '',
  urlInstance: ?string,
  noInstance: ?boolean,
  username: string,
  isAnonymous: boolean,
  settings: WikiSettingsT,
  privilege: 'owner' | 'editor' | 'user' | 'none'
};

class WikiComp extends React.Component<WikiCompPropsT, WikiCompStateT> {
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
      openDeletedPageModal: this.openDeletedPageModal,
      addNonActivePage: this.addNonActivePage
    };
    // turn on noFollowLinks for embedded pages
    wikiStore.setNoFollowLinks(props.embed);

    const query = this.props.query;
    this.wikiId = this.props.pageObj.wikiId;
    this.state = {
      username: getUsername(undefined, true),
      isAnonymous: Meteor.user().isAnonymous,
      pagesData: null,
      dashboardSearch: null,
      pageId: null,
      currentPageObj: null,
      initialPageTitle: this.props.pageObj.pageTitle,
      mode: 'document',
      docMode: query?.edit ? PERM_PASSWORD_TO_EDIT : PERM_PASSWORD_TO_VIEW,
      error: null,
      openCreator: false,
      search: '',
      rightSideCurrentPageObj: null,
      isOwner: false
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
    if (!this.props.embed) {
      Mousetrap.bindGlobal('ctrl+n', this.createPageModal);
      Mousetrap.bindGlobal('ctrl+s', () => this.setState({ docMode: 'view' }));
      Mousetrap.bindGlobal('ctrl+e', () => {
        if (!this.state.settings.readOnly) this.setState({ docMode: 'edit' });
      });
      Mousetrap.bindGlobal('ctrl+f', () =>
        this.setState({ findModalOpen: true })
      );
    }
  }

  componentDidUpdate(prevProps) {
    const pageTitle = this.props.pageObj.pageTitle;

    if (
      (pageTitle !== this.state.currentPageObj?.title &&
        prevProps.pageObj.pageTitle !== pageTitle) ||
      prevProps.pageObj.instance !== this.props.pageObj.instance
    ) {
      this.goToPageTitle(pageTitle, this.props.pageObj.instance);
    }
  }

  shouldComponentUpdate() {
    return !this.preventRenderUntilNextShareDBUpdate;
  }

  handleSettings = async privilege => {
    // Show locked modal if the wiki is locked
    if (this.state.settings.locked && privilege !== PRIVILEGE_OWNER) {
      this.setState({ currentPageObj: null });
      this.props.showModal(<LockedModal />);
      return false;
    } else if (!this.state.currentPageObj) {
      this.initialLoad = true;
      this.props.hideModal();
    }
    // Ask for password if wiki access is password restricted
    if (
      this.state.settings.restrict === PERM_PASSWORD_TO_VIEW &&
      privilege !== PRIVILEGE_VIEW &&
      privilege !== PRIVILEGE_OWNER
    ) {
      this.setState({ currentPageObj: null });
      const passwordPromise = new Promise(resolve => {
        this.props.showModal(
          <PasswordModal
            callback={resolve}
            hideModal={this.props.hideModal}
            actualPassword={this.state.settings.password}
          />
        );
      });
      const result = await passwordPromise;
      if (!result) {
        this.props.showModal(
          <AlertModal
            title="Unable to access Wiki"
            callback={() => {
              this.props.hideModal();
              this.loadWikiDoc();
            }}
          >
            This wiki has been password protected.
          </AlertModal>
        );
        return false;
      } else addUser(this.wikiDoc, Meteor.userId());
    } else if (!this.state.currentPageObj) {
      this.initialLoad = true;
      this.props.hideModal();
    }
    if (
      ((this.state.settings.readOnly ||
        this.state.settings.restrict === PERM_PASSWORD_TO_EDIT) &&
        privilege !== PRIVILEGE_OWNER) ||
      (!this.state.settings.allowPageCreation && privilege !== PRIVILEGE_OWNER)
    )
      wikiStore.setPreventPageCreation(true);
    else wikiStore.setPreventPageCreation(false);
    return true;
  };

  getPrivilege() {
    if (this.wikiDoc.data.owners?.find(x => x === Meteor.userId()))
      return PRIVILEGE_OWNER;
    if (this.wikiDoc.data.editors?.find(x => x === Meteor.userId()))
      return PRIVILEGE_EDIT;
    if (this.wikiDoc.data.users?.find(x => x === Meteor.userId()))
      return PRIVILEGE_VIEW;
    return PRIVILEGE_NONE;
  }

  loadWikiDoc = async () => {
    this.preventRenderUntilNextShareDBUpdate = false;

    if (!this.wikiDoc.data) {
      const liId = createNewLI(this.wikiId, 'li-richText');
      return createNewEmptyWikiDoc(
        this.wikiDoc,
        this.wikiId,
        liId,
        Meteor.userId()
      );
    }
    if (!this.wikiDoc.data.settings) upgradeWikiWithoutSettings(this.wikiDoc);
    wikiStore.setPages(this.wikiDoc.data.pages);
    const setPrivilegePromise = new Promise(resolve => {
      this.setState(
        {
          pagesData: wikiStore.pages,
          settings: this.wikiDoc.data.settings,
          privilege: this.getPrivilege()
        },
        () => this.handleSettings(this.state.privilege).then(x => resolve(x))
      );
    });
    const continuePrivilege = await setPrivilegePromise;
    if (!continuePrivilege) return;
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
      currentPageObj.pageSettings = newPageObj.pageSettings;
      if (
        newPageObj.pageSettings !== undefined &&
        newPageObj.pageSettings.hidden &&
        this.getPrivilege() !== PRIVILEGE_OWNER
      ) {
        this.goToPageTitle('Home', () =>
          this.props.showModal(
            <AlertModal
              title="Unable to view Page"
              callback={() => {
                this.props.hideModal();
              }}
            >
              This page is hidden by the owner.
            </AlertModal>
          )
        );
      }
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
    let fullPageObj = parsedPages[pageTitleLower];

    if (!fullPageObj) {
      this.initialLoad = true;
      this.createPage(pageTitle, 3);
      return;
    }

    if (
      fullPageObj.pageSettings?.hidden &&
      this.state.privilege !== PRIVILEGE_OWNER
    ) {
      this.props.showModal(
        <AlertModal
          title="Unable to view Page"
          callback={() => {
            this.props.hideModal();
          }}
        >
          This page is hidden by the owner.
        </AlertModal>
      );
      fullPageObj = parsedPages['home'];
    }

    let instanceId =
      this.getInstanceIdForName(fullPageObj, this.props.pageObj.instance) ||
      this.getInstanceId(fullPageObj);
    if (
      fullPageObj.pageSettings !== undefined &&
      !fullPageObj.pageSettings.allowView &&
      instanceId !== Meteor.userId() &&
      this.state.privilege !== PRIVILEGE_OWNER
    ) {
      this.props.showModal(
        <AlertModal
          title="Unable to view Page Instance"
          callback={() => {
            this.props.hideModal();
          }}
        >
          Viewing other instances has been restricted by the owner.
        </AlertModal>
      );
      instanceId = Meteor.userId();
    }
    const currentPageObj = this.getProperCurrentPageObj(
      fullPageObj,
      instanceId
    );
    if (!currentPageObj) {
      if (!fullPageObj.noNewInstances) {
        this.initialLoad = true;
        const instanceName = getUsername(undefined, true);
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
        this.props.setPage({
          wikiId: this.wikiId,
          pageTitle: currentPageObj.title,
          instance:
            instanceId && instanceId !== this.getInstanceId(fullPageObj)
              ? instanceName
              : null
        });
      }
    );
  };

  getProperCurrentPageObj = (fullPageObj, instanceId) => {
    if (!fullPageObj || fullPageObj.plane === 3) return fullPageObj;

    const instanceObj = fullPageObj.instances[instanceId];
    if (!instanceObj) {
      if (fullPageObj.noNewInstances) {
        return fullPageObj;
      } else {
        return null;
      }
    }

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

  getInstanceNameForUser = pageObj => {
    if (pageObj.plane === 1) return getUsername(undefined, true);
    if (pageObj.plane === 2) {
      const userId = Meteor.userId();
      const groupNumber = findKey(pageObj.socialStructure, x =>
        x.includes(userId)
      );
      return pageObj.groupingAttribute + ' ' + groupNumber;
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
    changeWikiPageTitle(this.wikiDoc, pageId, sanitizeTitle(newPageTitle));
    this.props.setPage(
      {
        wikiId: this.wikiId,
        pageTitle: sanitizeTitle(newPageTitle),
        instance: this.props.pageObj.instance
      },
      true
    );
  };

  goToPage = (pageId, cb, side, foreignInstanceId) => {
    const fullPageObj = wikiStore.pages[pageId];
    if (
      fullPageObj.pageSettings !== undefined &&
      fullPageObj.pageSettings.hidden &&
      this.state.privilege !== PRIVILEGE_OWNER
    ) {
      this.props.showModal(
        <AlertModal
          title="Unable to view Page"
          callback={() => {
            this.props.hideModal();
          }}
        >
          This page is hidden by the owner.
        </AlertModal>
      );
      return;
    }
    const instanceId = foreignInstanceId || this.getInstanceId(fullPageObj);
    const newCurrentPageObj = this.getProperCurrentPageObj(
      fullPageObj,
      instanceId
    );
    if (
      fullPageObj.pageSettings !== undefined &&
      !fullPageObj.pageSettings.allowView &&
      instanceId !== Meteor.userId() &&
      this.state.privilege !== PRIVILEGE_OWNER
    ) {
      this.props.showModal(
        <AlertModal
          title="Unable to view Page Instance"
          callback={() => {
            this.props.hideModal();
          }}
        >
          Viewing other instances has been restricted by the owner.
        </AlertModal>
      );
      return;
    }
    if (!newCurrentPageObj) {
      if (!fullPageObj.noNewInstances) {
        this.initialLoad = true;
        this.setState(
          {
            initialPageTitle: fullPageObj.title
          },
          () => {
            if (foreignInstanceId) return;
            const instanceName = this.getInstanceNameForUser(fullPageObj);
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
        if (cb) {
          this.props.setPage(
            {
              wikiId: this.wikiId,
              pageTitle: newCurrentPageObj.title,
              instance:
                instanceId && instanceId !== this.getInstanceId(fullPageObj)
                  ? instanceName
                  : null
            },
            true
          );
          return cb();
        }
        this.props.setPage({
          wikiId: this.wikiId,
          pageTitle: newCurrentPageObj.title,
          instance:
            instanceId && instanceId !== this.getInstanceId(fullPageObj)
              ? instanceName
              : null
        });
      }
    );
  };

  goToPageTitle = (pageTitle, instanceName, side, cb) => {
    const pageTitleLower = sanitizeTitle(pageTitle.toLowerCase());
    const pageId = wikiStore.parsedPages[pageTitleLower].id;
    const instanceId = this.getInstanceIdForName(
      wikiStore.parsedPages[pageTitleLower],
      instanceName
    );
    this.goToPage(pageId, cb, side, instanceId);
  };

  // Creates a new page entry in ShareDB and navigates to it.
  createPage = async (
    title,
    socialPlane,
    activityConfig,
    operatorConfig,
    pageSettings
  ) => {
    const error =
      checkNewPageTitle(wikiStore.parsedPages, title) ||
      (activityConfig?.invalid && 'Activity config is not valid') ||
      (operatorConfig?.invalid && 'Operator config is not valid');
    if (error) {
      return error;
    }
    this.preventRenderUntilNextShareDBUpdate = true;

    let opData;
    if (activityConfig && activityConfig.activityType.slice(0, 3) === 'op-') {
      const rawData = await new Promise(resolve =>
        Meteor.call(
          'run.operator',
          activityConfig.activityType,
          activityConfig.config,
          (err, res) => {
            if (err) {
              return 'Operator failed to run';
            } else {
              resolve(res);
            }
          }
        )
      );

      opData = entries(rawData.payload.all.data).reduce(
        (acc, [k, v]) => ({
          ...acc,
          [k]: { ...v, votes: {}, categories: [] }
        }),
        {}
      );

      activityConfig.activityType = 'ac-gallery';
      activityConfig.config = {
        canVote: true,
        canSearch: true,
        canBookmark: true
      };
    }

    const liType = activityConfig ? 'li-activity' : 'li-richText';
    const liId = createNewLI(
      this.wikiId,
      liType,
      activityConfig,
      title,
      opData
    );
    const pageId = addNewWikiPage(
      this.wikiDoc,
      sanitizeTitle(title),
      true,
      liType,
      liId,
      socialPlane,
      pageSettings
    );
    this.goToPage(pageId);
    return { pageId, liId };
  };

  // there is a link to a page that has not yet been formally created, until
  // clicked upon, but we still keep track of it.
  addNonActivePage = title => {
    const sanitizedTitle = sanitizeTitle(title);
    const existingPage = wikiStore.pagesByTitle[sanitizedTitle];
    if (existingPage) {
      return { liId: existingPage.liId, pageId: existingPage.id };
    }
    const liType = 'li-richText';
    const liId = createNewLI(this.wikiId, liType, undefined, title);
    const pageId = addNewWikiPage(
      this.wikiDoc,
      sanitizedTitle,
      false,
      liType,
      liId,
      3
    );
    return { liId, pageId };
  };

  /**
   * Check / Ask for granting edit access
   * @param {string} action - The action for which the access is being checked could be either 'createPage' or 'editPage'
   * @return {boolean} True if access was granted false otherwise
   */
  editAccess = async action => {
    if (this.state.privilege === PRIVILEGE_OWNER) return true;
    if (action === 'createPage' && !this.state.settings.allowPageCreation) {
      this.props.showModal(
        <AlertModal
          title="Unable to create Page"
          callback={() => {
            this.props.hideModal();
          }}
        >
          Page creation has been restricted by the owner.
        </AlertModal>
      );
      return false;
    }
    if (this.state.settings.readOnly) {
      this.props.showModal(
        <AlertModal
          title="Unable to edit Wiki"
          callback={() => {
            this.props.hideModal();
          }}
        >
          This wiki is read only.
        </AlertModal>
      );
      return false;
    }

    if (
      this.state.settings.restrict === PERM_PASSWORD_TO_EDIT &&
      this.state.privilege !== PRIVILEGE_EDIT
    ) {
      const passwordPromise = new Promise(resolve => {
        this.props.showModal(
          <PasswordModal
            callback={resolve}
            hideModal={this.props.hideModal}
            actualPassword={this.state.settings.password}
          />
        );
      });
      const result = await passwordPromise;
      if (!result)
        this.props.showModal(
          <AlertModal
            title="Unable to edit Wiki"
            callback={() => {
              this.props.hideModal();
            }}
          >
            This wiki has been password protected.
          </AlertModal>
        );
      else addEditor(this.wikiDoc, Meteor.userId());
      return result;
    }
    const fullPageObj = this.state.currentPageObj;
    const instanceId = this.state.currentPageObj.instanceId;
    if (
      instanceId &&
      fullPageObj.pageSettings !== undefined &&
      !fullPageObj.pageSettings.allowEdit &&
      instanceId !== Meteor.userId()
    ) {
      this.props.showModal(
        <AlertModal
          title="Unable to edit Page Instance"
          callback={() => {
            this.props.hideModal();
          }}
        >
          The page creator has disabled editing other peoples instances.
        </AlertModal>
      );
      return false;
    }
    if (
      this.state.currentPageObj.pageSettings !== undefined &&
      this.state.currentPageObj.pageSettings.readOnly
    ) {
      this.props.showModal(
        <AlertModal
          title="Unable to edit Page"
          callback={() => {
            this.props.hideModal();
          }}
        >
          This page is read only.
        </AlertModal>
      );
      return false;
    }
    return true;
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

  createPageModal = () =>
    this.editAccess('createPage').then(result => {
      if (result)
        this.props.showModal(
          <PageSettings
            onSubmit={(
              title,
              socialPlane,
              activityConfig,
              operatorConfig,
              pageSettings
            ) =>
              new Promise(resolve =>
                this.editAccess('createPage').then(async x => {
                  if (x) {
                    const res = await this.createPage(
                      title,
                      socialPlane,
                      activityConfig,
                      operatorConfig,
                      pageSettings
                    );
                    if (typeof res === 'string') resolve(res);
                    else resolve(null);
                  }
                  resolve(null);
                })
              )
            }
            isOwner={this.state.privilege === PRIVILEGE_OWNER}
            hideModal={this.props.hideModal}
            wikiId={this.wikiId}
            action="create"
          />
        );
    });

  render() {
    if (!this.state.currentPageObj) return null;
    const validPages = wikiStore.pagesArrayOnlyValid;
    const invalidPages = wikiStore.pagesArrayOnlyInvalid;

    let foundPages = validPages;
    if (this.state.privilege !== PRIVILEGE_OWNER) {
      foundPages = foundPages.filter(
        x => !x.pageSettings || !x.pageSettings.hidden
      );
    }
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

    if (this.getPrivilege() === PRIVILEGE_OWNER) {
      secondaryNavItems.push({
        title: 'Wiki Settings',
        icon: Tune,
        callback: () =>
          this.props.showModal(
            <PermissionsModal
              callback={x => {
                updateSettings(this.wikiDoc, x);
              }}
              hideModal={this.props.hideModal}
              currentSettings={this.state.settings}
            />
          )
      });
      secondaryNavItems.push({
        title: 'Page Settings',
        icon: SettingsApplications,
        callback: () => {
          this.props.showModal(
            <PageSettings
              onSubmit={async (
                title,
                socialPlane,
                activityConfig,
                operatorConfig,
                pageSettings
              ) => {
                if (title !== this.state.currentPageObj.title) {
                  const error = checkNewPageTitle(wikiStore.parsedPages, title);
                  if (error) return error;
                  this.changeTitle(this.state.currentPageObj.id, title);
                }
                updatePageSettings(
                  this.wikiDoc,
                  this.state.currentPageObj.id,
                  socialPlane,
                  pageSettings
                );
                return null;
              }}
              isOwner={this.state.privilege === PRIVILEGE_OWNER}
              hideModal={this.props.hideModal}
              socialPlane={this.state.currentPageObj.plane}
              pageSettings={this.state.currentPageObj.pageSettings}
              title={this.state.currentPageObj.title}
              wikiId={this.wikiId}
              action="edit"
            />
          );
        }
      });
    }
    if (getUserType() === 'Anonymous') {
      secondaryNavItems.push({
        title: 'Create an account',
        icon: LockOutlinedIcon,
        callback: () =>
          this.props.showModal(<AccountModal formToDisplay="signup" />)
      });
      secondaryNavItems.push({
        title: 'Login',
        icon: LockOutlinedIcon,
        callback: () =>
          this.props.showModal(<AccountModal formToDisplay="login" />)
      });
    } else if (getUserType() === 'Verified') {
      secondaryNavItems.push({
        title: 'Logout',
        icon: LockOutlinedIcon,
        callback: () => {
          sessionStorage.removeItem('frog.sessionToken');
          Meteor.logout(() => window.location.reload());
        }
      });
      secondaryNavItems.push({
        title: 'Change password',
        icon: LockOutlinedIcon,
        callback: () => {
          this.props.showModal(<ChangePasswordModal />);
        }
      });
    } else if (getUserType() === 'Legacy') {
      secondaryNavItems.push({
        title: 'Upgrade your account',
        icon: LockOutlinedIcon,
        callback: () => {
          this.props.showModal(<AccountModal formToDisplay="signup" />);
        }
      });

      secondaryNavItems.push({
        title: 'Logout',
        icon: LockOutlinedIcon,
        callback: () => {
          sessionStorage.removeItem('frog.sessionToken');
          Meteor.logout(() => window.location.reload());
        }
      });
    }

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
                data-testid="wiki_page_instance_item"
              >
                {line}
              </li>
            );
          });

    const sideNavBar = (
      <div style={sideNavBarStyle} data-testid="sidebar">
        <h2>{this.wikiId}</h2>
        <ul data-testid="wiki_pages">
          <Button
            variant="contained"
            color="primary"
            onClick={this.createPageModal}
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
            <ul data-testid="wiki_page_instances">{instancesList}</ul>
          </div>
        )}
      </div>
    );
    return (
      <div>
        <div style={containerDivStyle}>
          {!this.props.embed && sideNavBar}
          <div style={contentDivStyle}>
            {!this.props.embed && (
              <WikiTopNavbar
                username={getUsername(undefined, true)}
                isAnonymous={Meteor.user().isAnonymous}
                primaryNavItems={primaryNavItems}
                secondaryNavItems={secondaryNavItems}
              />
            )}
            <div style={wikiPagesDivContainerStyle}>
              <WikiContentComp
                hidden={
                  this.state.currentPageObj.pageSettings?.hidden &&
                  this.state.privilege !== PRIVILEGE_OWNER
                }
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
                checkEdit={() => this.editAccess('editPage')}
                settings={this.state.settings}
                embed={this.props.embed}
              />
              {this.state.mode === 'splitview' && (
                <WikiContentComp
                  hidden={
                    this.state.rightSideCurrentPageObj.pageSettings?.hidden &&
                    this.state.privilege !== PRIVILEGE_OWNER
                  }
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
                  checkEdit={() => this.editAccess('editPage')}
                  settings={this.state.settings}
                  embed={this.props.embed}
                />
              )}
            </div>
          </div>
        </div>
        {this.state.findModalOpen && (
          <FindModal
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
      </div>
    );
  }
}

const Wiki = withModal(WikiComp);
Wiki.displayName = 'Wiki';

export default Wiki;
