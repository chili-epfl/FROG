// @flow

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
export const dataFn = generateReactiveFn(genericDoc, LI, {
  createdByUser: Meteor.userId()
});
const LearningItem = dataFn.LearningItem;

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
  dashboardOpen: boolean,
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

  constructor(props) {
    super(props);
    if (!this.wikiId) throw new Error('Empty wikiId field');

    const query = queryToObject(this.props.location.search.slice(1));
    this.state = {
      dashboardSearch: null,
      dashboardOpen: false,
      pageTitle: this.props.match.params.pageTitle || null,
      pageTitleString: this.props.match.params.pageTitle || null,
      urlInstance: this.props.match.params.instance || null,
      mode: 'document',
      docMode: query.edit ? 'edit' : 'view',
      editingTitle: false,
      data: [],
      error: null,
      openCreator: false,
      showTitleEditButton: false,
      createModalOpen: false,
      search: '',
      deletedPageModalOpen: false,
      currentDeletedPageId: null,
      currentDeletedPageTitle: null,
      wikiContext: {
        getWikiId: this.getWikiId,
        getWikiPages: this.getWikiPages,
        getOnlyValidWikiPages: this.getOnlyValidWikiPages,
        getPageObjForTitle: this.getPageObjForTitle
      }
    };
  }

  getInstanceId = page => {
    const urlInstance = this.props.match.params.instance || false;
    if (!page || page.liId) {
      return 'all';
    }
    if (urlInstance) {
      if (page.plane === 2) {
        return urlInstance.trim();
      }
      return findKey(page.instances, x => x.username === urlInstance.trim());
    }
    const userId = Meteor.userId();
    if (page.plane === 1) {
      return page.instances[userId]
        ? userId
        : page.noNewInstances
        ? undefined
        : userId;
    }

    if (page.plane === 2) {
      const group = findKey(page.socialStructure, x => x.includes(userId));
      return group || (page.noNewInstances ? 'Group activity' : 'Other group');
    }
    return 'all';
  };

  getInstanceName = page => {
    if (!page || page.plane === 3 || page.liId) {
      return '';
    }
    const instanceId = this.getInstanceId(page);
    if (page.plane === 2) {
      return instanceId;
    }
    return (
      page.instances[instanceId]?.username ||
      (page.noNewInstances ? 'Individual activity' : '')
    );
  };

  createActivityPage = (newTitle, rawconfig) => {
    const { activityType, config, invalid } = rawconfig;
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

    const newId = dataFn.createLearningItem(
      'li-activity',
      payload,
      {
        title: newTitle
      },
      true
    );

    addNewWikiPage(this.wikiDoc, newTitle, true, 'li-activity', 3, {
      all: { liId: newId }
    });
    this.setState({
      mode: 'document'
    });
  };

  WikiLink = observer(({ data }) => {
    const pageObj = wikistore.pages[data.id];
    const style = {
      textDecoration: 'underline',
      cursor: 'pointer',
      color: 'black'
    };
    if (!pageObj) {
      return <span style={style}>INVALID LINK</span>;
    }
    const pageTitle = pageObj.title;
    const link =
      '/wiki/' +
      this.wikiId +
      '/' +
      pageTitle +
      (data.instance ? '/' + data.instance : '');

    const linkFn = e => {
      e.preventDefault();
      this.props.history.push(link);
    };

    const createLinkFn = e => {
      e.preventDefault();
      const linkWithEdit = link + '?edit=true';
      this.props.history.push(linkWithEdit);
      setTimeout(() => markPageAsCreated(this.wikiDoc, pageObj.id), 500);
    };
    const displayTitle = pageTitle + (data.instance ? '/' + data.instance : '');

    if (!pageObj.created) {
      style.color = 'green';

      return (
        <span onClick={createLinkFn} style={style}>
          <b>{displayTitle}</b>
        </span>
      );
    }

    const deletePageLinkFn = e => {
      e.preventDefault();
      this.setState({
        deletedPageModalOpen: true,
        currentDeletedPageId: pageObj.id,
        currentDeletedPageTitle: pageObj.title
      });
    };
    if (!pageObj.valid) {
      style.color = 'red';
      style.cursor = 'not-allowed';
      return (
        <span onClick={deletePageLinkFn} style={style}>
          {pageTitle}
        </span>
      );
    }

    style.color = 'blue';

    return (
      <span onClick={linkFn} style={style}>
        <b>{displayTitle}</b>
      </span>
    );
  });

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
    if (!this.wikiDoc.data) {
      const emptyDocValues = {
        wikiId: this.wikiId,
        pages: {
          home: {
            id: 'home',
            valid: true,
            created: true,
            title: 'Home',
            liType: 'li-richText',
            instances: {},
            plane: 3
          }
        }
      };
      this.wikiDoc.create(emptyDocValues);
      return;
    }

    const parsedPages = parseDocResults(this.wikiDoc.data);
    wikistore.setPages(this.wikiDoc.data.pages);
    const pageTitle = getPageTitle(parsedPages, this.state.pageTitle);
    if (!pageTitle) {
      return;
    }

    const query = queryToObject(this.props.location.search.slice(1));
    const page = parsedPages[pageTitle.toLowerCase()];
    if (!page) {
      return this.createNewPageLI(pageTitle || 'Home', true);
    }
    const instanceId = this.getInstanceId(page);

    if (pageTitle) {
      const pageId = parsedPages[pageTitle.toLowerCase()].id;
      const currentLI = parsedPages[pageTitle.toLowerCase()].liId;

      let deletedPageModalOpen = false;
      let currentDeletedPageId = null;
      let currentDeletedPageTitle = null;
      if (!parsedPages[pageTitle.toLowerCase()].valid) {
        deletedPageModalOpen = true;
        currentDeletedPageId = pageId;
        currentDeletedPageTitle = pageTitle;
      }

      const page = parsedPages[pageTitle.toLowerCase()];
      if (!page) {
        return this.createNewPageLI(pageTitle || 'Home', true);
      }
      const instanceId = this.getInstanceId(page);

      this.ensureInstance(page, () => {
        this.setState(
          {
            page,
            pageTitle: page.title,
            pageTitleString: page.title,
            deletedPageModalOpen,
            currentDeletedPageId,
            currentDeletedPageTitle,
            search: '',
            instance: instanceId,
            findModalOpen: false,
            currentLI: page.liId || page.instances[instanceId]?.liId,
            docMode:
              page.liType === 'li-activity' || query.edit
                ? 'edit'
                : this.state.docMode
          },
          () => {
            if (!this.props.match.params.pageTitle) {
              const link = '/wiki/' + this.wikiId + '/' + pageTitle;
              this.props.history.replace(link);
            }
          }
        );
      });
    }
  };

  getWikiId = () => {
    return this.wikiId;
  };

  getPageObjForTitle = (pageTitle: string) => {
    const pageTitleLower = pageTitle.toLowerCase();
    const parsedPages = parseDocResults(this.wikiDoc.data);
    return parsedPages[pageTitleLower];
  }

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

  createNewPageLI = (title, published, liType, p1) =>
    addNewWikiPage(
      this.wikiDoc,
      title,
      published,
      liType || 'li-richText',
      p1 ? 1 : 3
    );

  componentDidUpdate(prevProps) {
    if (
      (prevProps.match.params.pageTitle !== this.props.match.params.pageTitle ||
        prevProps.match.params.instance !== this.props.match.params.instance) &&
      this.wikiDoc != null
    ) {
      const query = queryToObject(this.props.location.search.slice(1));
      const pages = parseDocResults(this.wikiDoc.data);
      const newPageTitle = this.props.match.params.pageTitle;

      if (!newPageTitle) return;

      const page = pages[newPageTitle.toLowerCase()];
      if (!page) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState(
          {
            search: '',
            findModalOpen: false,
            createModalOpen: false,
            page: null,
            pageTitle: newPageTitle,
            pageTitleString: newPageTitle,
            urlInstance: this.props.match.params.instance || null,
            docMode:
              pages[newPageTitle.toLowerCase()].liType === 'li-activity' ||
              query.edit
                ? 'edit'
                : 'view'
          },
          () => {
            this.createNewPageLI(newPageTitle, true);
          }
        );

        return;
      }
      // eslint-disable-next-line react/no-did-update-set-state

      const instanceId = this.getInstanceId(page);

      this.ensureInstance(page, () => {
        this.setState({
          search: '',
          page,
          findModalOpen: false,
          mode: 'document',
          error: null,
          urlInstance: this.props.match.params.instance || null,
          currentLI: page.liId || page.instances[instanceId]?.liId,
          createModalOpen: false,
          pageTitle: newPageTitle,
          pageTitleString: newPageTitle,
          docMode:
            pages[newPageTitle.toLowerCase()].liType === 'li-activity' ||
            query.edit
              ? 'edit'
              : 'view'
        });
      });
    }
  }

  ensureInstance = (page, cb) => {
    if (!page.noNewInstances) {
      const instanceId = this.getInstanceId(page);
      if (!page.liId && !page.instances[instanceId]?.liId) {
        const meta = {
          wikiId: this.wikiId
        };

        const newId = dataFn.createLearningItem(
          page.liType || 'li-richText',
          undefined,
          meta,
          undefined,
          undefined,
          undefined
        );
        const username = page.plane === 1 ? Meteor.user().username : undefined;

        addInstance(this.wikiDoc, page.id, instanceId, newId, username);
      }
    }
    if (cb) {
      cb();
    }
  };

  createLI = (newTitle, liType = 'li-richText', li, config, p1) => {
    const parsedPages = parseDocResults(this.wikiDoc.data);
    const newTitleLower = newTitle.toLowerCase();
    if (newTitleLower === '') {
      this.setState({
        error: 'Title cannot be empty'
      });
      return;
    } else if (newTitle.includes('/')) {
      this.setState({
        error: 'Title cannot contain /'
      });
      return;
    } else if (parsedPages[newTitleLower]) {
      if (parsedPages[newTitleLower].valid) {
        this.setState({
          error: 'Title already used'
        });
      } else {
        restoreWikiPage(this.wikiDoc, parsedPages[newTitleLower].id);
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
      }

      return;
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

  deleteLI = (pageId: ?string) => {
    if (!pageId) throw new Error('Missing pageId for deletion');

    const parsedPages = parseDocResults(this.wikiDoc.data);
    const newPageTitle = getPageTitle(parsedPages, null, pageId);
    if (!newPageTitle) throw new Error('Missing new page title');

    const link = '/wiki/' + this.wikiId + '/' + newPageTitle;
    this.props.history.replace(link);
    setTimeout(
      () => invalidateWikiPage(this.wikiDoc, pageId, this.loadWikiDoc),
      100
    );
  };

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

  goToPage = pageTitle => {
    const link = '/wiki/' + this.wikiId + '/' + pageTitle;
    this.props.history.push(link);
  };

  restoreDeletedPage = (pageId, pageTitle) => {
    restoreWikiPage(this.wikiDoc, pageId);
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

  createNewLIForPage = (pageId, pageTitle, liType) => {
    restoreWikiPage(this.wikiDoc, pageId);

    const meta = {
      wikiId: this.wikiId
    };

    const newId = dataFn.createLearningItem(
      liType || 'li-richText',
      undefined,
      meta,
      undefined,
      undefined,
      undefined
    );

    changeWikiPageLI(this.wikiDoc, pageId, newId);
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

    const navbarsColor = 'white';

    const sideNavBarStyle = {
      width: '250px',
      backgroundColor: navbarsColor,
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
        this.state.page?.liType === 'li-activity'
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

    const topNavBarStyle = {
      display: 'flex',
      flex: '0 0 50px',
      cursor: 'pointer',
      width: '100%',
      backgroundColor: navbarsColor,
      borderBottom: '1px lightgrey solid'
    };

    const topNavBarItemWidth = validPages.length > 1 ? '20%' : '25%';

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

    const topNavBar = (
      <div style={topNavBarStyle}>
        <div
          style={topNavBarItemStyle}
          onClick={() => {
            this.setState({ mode: 'document', docMode: 'view' });
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
            this.setState({ mode: 'revisions', docMode: 'view' });
          }}
        >
          <History style={iconButtonStyle} color={itemColors['revisions']} />
          <span style={{ color: itemColors['revisions'] }}>Revisions</span>
        </div>
        <div
          style={topNavBarItemStyle}
          onClick={() => {
            this.setState({ mode: 'dashboard', docMode: 'view' });
          }}
        >
          <Dashboard style={iconButtonStyle} color={itemColors['dashboard']} />
          <span style={{ color: itemColors['dashboard'] }}>All Pages</span>
        </div>
        {validPagesIncludingCurrent.length > 1 ? (
          <div
            style={topNavBarItemStyle}
            onClick={() => {
              this.deleteLI(this.state.page.id);
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

    return (
      <div>
        <WikiContext.Provider value={this.state.wikiContext}>
          <div style={containerDivStyle}>
            {sideNavBar}
            <div style={contentDivStyle}>
              {topNavBar}
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
                      flex: '0 0 calc(100vh - 102px)',
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
