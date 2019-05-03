// @flow

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { WikiContext, values, uuid, SearchField } from 'frog-utils';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Meteor } from 'meteor/meteor';
import Mousetrap from 'mousetrap';
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
  changeWikiPageTitle
} from './wikiDocHelpers';
import { wikistore } from './store';
import LIDashboard from '../Dashboard/LIDashboard';
import Revisions from './Revisions';
import CreateModal from './ModalCreate';
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
  pageId: ?string,
  pageTitle: ?string,
  pageTitleString: ?string,
  mode: string,
  docMode: string,
  editingTitle: boolean,
  liType: string,
  error: ?string,
  openCreator: ?Object,
  showTitleEditButton: boolean,
  wikiContext: Object,
  pageLiType: ?string,
  createModalOpen: boolean,
  findModalOpen: boolean,
  search: '',
  currentLI: ?string
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
      pageId: null,
      currentLI: null,
      pageTitle: this.props.match.params.pageTitle || null,
      pageTitleString: this.props.match.params.pageTitle || null,
      mode: 'document',
      docMode: query.edit ? 'edit' : 'view',
      editingTitle: false,
      data: [],
      liType: 'li-richText',
      error: null,
      openCreator: false,
      showTitleEditButton: false,
      pageLiType: null,
      createModalOpen: false,
      search: '',
      wikiContext: {
        getWikiId: this.getWikiId,
        getWikiPages: this.getWikiPages,
        getOnlyValidWikiPages: this.getOnlyValidWikiPages,
        createPage: this.createNewPageLI,
        save: () => this.setState({ docMode: 'view' })
      }
    };
  }

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

    const newId = dataFn.createLearningItem('li-activity', payload, {
      title: newTitle
    });

    addNewWikiPage(this.wikiDoc, newId, newTitle, 'li-activity');
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
    const link = '/wiki/' + this.wikiId + '/' + pageTitle;
    const linkFn = e => {
      e.preventDefault();
      this.props.history.push(link);
    };

    if (!pageObj.valid) {
      style.color = 'red';
      style.cursor = 'not-allowed';
      return <span style={style}>{pageTitle}</span>;
    }

    style.color = 'blue';

    return (
      <span onClick={linkFn} style={style}>
        <b>{pageTitle}</b>
      </span>
    );
  });

  componentDidMount() {
    window.frog_WikiLink = this.WikiLink;
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

    Mousetrap.bind('ctrl+n', () => this.setState({ createModalOpen: true }));
    Mousetrap.bind('ctrl+s', () => this.setState({ docMode: 'view' }));
    Mousetrap.bind('ctrl+e', () => this.setState({ docMode: 'edit' }));
    Mousetrap.bind('ctrl+f', () => this.setState({ findModalOpen: true }));
  }

  loadWikiDoc = () => {
    if (!this.wikiDoc.data) {
      const emptyDocValues = {
        wikiId: this.wikiId,
        pages: {}
      };
      this.wikiDoc.create(emptyDocValues);
      return;
    }

    const parsedPages = parseDocResults(this.wikiDoc.data);
    wikistore.setPages(this.wikiDoc.data.pages);
    const pageTitle = getPageTitle(parsedPages, this.state.pageTitle);
    const query = queryToObject(this.props.location.search.slice(1));
    if (pageTitle != null) {
      const pageId = parsedPages[pageTitle.toLowerCase()].id;
      const currentLI = parsedPages[pageTitle.toLowerCase()].liId;

      this.setState({
        pageId,
        currentLI,
        pageTitle,
        pageTitleString: pageTitle,
        search: '',
        findModalOpen: false,
        pageLiType: parsedPages[pageTitle.toLowerCase()].liType,
        docMode:
          parsedPages[pageTitle.toLowerCase()].liType === 'li-activity' ||
          query.edit
            ? 'edit'
            : this.state.docMode
      });
    } else {
      this.createNewPageLI('Home');
    }
  };

  getWikiId = () => {
    return this.wikiId;
  };

  getWikiPages = () => {
    return values(wikistore.pages).map(pageObj =>
      parsePageObjForReactiveRichText(this.wikiId, pageObj)
    );
  };

  getOnlyValidWikiPages = () => {
    return values(wikistore.pages)
      .filter(x => x.valid)
      .map(pageObj => parsePageObjForReactiveRichText(this.wikiId, pageObj));
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.match.params.pageTitle !== this.props.match.params.pageTitle &&
      this.wikiDoc != null
    ) {
      const query = queryToObject(this.props.location.search.slice(1));
      const pages = parseDocResults(this.wikiDoc.data);
      const newPageTitle = this.props.match.params.pageTitle;
      if (!newPageTitle) return;

      if (!pages[newPageTitle.toLowerCase()]) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState(
          {
            search: '',
            findModalOpen: false,
            createModalOpen: false,
            pageId: null,
            currentLI: null,
            pageTitle: newPageTitle,
            pageTitleString: newPageTitle,
            pageLiType: pages[newPageTitle.toLowerCase()].liType,
            docMode:
              pages[newPageTitle.toLowerCase()].liType === 'li-activity' ||
              query.edit
                ? 'edit'
                : 'view'
          },
          () => {
            this.createNewPageLI(newPageTitle);
          }
        );

        return;
      }

      const pageId = pages[newPageTitle.toLowerCase()].id;
      const liId = pages[newPageTitle.toLowerCase()].liId;
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        search: '',
        findModalOpen: false,
        pageId,
        currentLI: liId,
        mode: 'document',
        liType: 'li-richText',
        error: null,
        createModalOpen: false,
        pageTitle: newPageTitle,
        pageTitleString: newPageTitle,
        docMode:
          pages[newPageTitle.toLowerCase()].liType === 'li-activity' ||
          query.edit
            ? 'edit'
            : 'view',
        pageLiType: pages[newPageTitle.toLowerCase()].liType
      });
    }
  }

  createNewPageLI = (pageTitle: string, liType: ?string) => {
    if (!pageTitle) throw new Error('Empty pageTitleRaw');
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

    addNewWikiPage(this.wikiDoc, newId, pageTitle, 'li-richText');
    return newId;
  };

  createLI = (newTitle, liType = 'li-richText', li, config) => {
    const parsedPages = parseDocResults(this.wikiDoc.data);
    if (newTitle === '') {
      this.setState({
        error: 'Title cannot be empty'
      });
      return;
    } else if (parsedPages[newTitle]) {
      this.setState({
        error: 'Title already used'
      });
      return;
    }

    if (li) {
      addNewWikiPage(this.wikiDoc, li, newTitle, liType);
    } else if (config && config.activityType) {
      this.createActivityPage(newTitle, config);
    } else {
      this.createNewPageLI(newTitle, liType);
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
    invalidateWikiPage(this.wikiDoc, pageId, this.loadWikiDoc);
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

  render() {
    if (!this.state.pageId || !this.state.pageTitle || !this.state.currentLI)
      return null;

    const validPages = this.getOnlyValidWikiPages();
    let pages = validPages;
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
      backgroundColor: 'lightgrey',
      overflowX: 'hidden',
      overflowY: 'auto',
      padding: '10px',
      borderRight: '1px grey solid'
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
      fontSize: '30px'
    };

    const docModeButtonStyle = {
      fontSize: '16px',
      marginRight: '20px'
    };

    const docModeButton = (() => {
      if (
        this.state.docMode === 'history' ||
        this.state.pageLiType === 'li-activity'
      )
        return null;
      if (this.state.docMode === 'view')
        return (
          <button
            style={docModeButtonStyle}
            onClick={() => {
              this.setState({ docMode: 'edit' });
            }}
          >
            Edit This Page
          </button>
        );
      return (
        <button
          style={docModeButtonStyle}
          onClick={() => {
            this.setState({ docMode: 'view' });
          }}
        >
          Finish
        </button>
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
          <span>{this.state.pageTitle}</span>
          {this.state.showTitleEditButton && (
            <Edit onClick={this.handleEditingTitle} />
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
      backgroundColor: 'lightgrey'
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
          <span stlye={{ color: itemColors['document'] }}>Page</span>
        </div>
        <div
          style={topNavBarItemStyle}
          onClick={() => {
            this.setState({ mode: 'document', docMode: 'history' });
          }}
        >
          <History style={iconButtonStyle} color={itemColors['history']} />
          <span style={{ color: itemColors['history'] }}>History</span>
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
          <span style={{ color: itemColors['dashboard'] }}>Dashboard</span>
        </div>
        {validPages.length > 1 ? (
          <div
            style={topNavBarItemStyle}
            onClick={() => {
              this.deleteLI(this.state.pageId);
            }}
          >
            <Delete style={iconButtonStyle} color={itemColors['delete']} />
            <span style={{ color: itemColors['delete'] }}>Delete Page</span>
          </div>
        ) : null}
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
                <Revisions doc={this.state.pageId} />
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
                      flex: '0 0 calc(100vh - 100px)',
                      height: 'calc(100vh - 100px)',
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
                      <LearningItem
                        type={this.state.docMode}
                        id={this.state.currentLI}
                      />
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
        </WikiContext.Provider>
      </div>
    );
  }
}

const Wiki = withRouter(WikiComp);
Wiki.displayName = 'Wiki';

export default Wiki;
