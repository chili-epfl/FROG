// @flow

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { WikiContext, values, A, uuid } from 'frog-utils';
import {
  FormControl,
  Select,
  MenuItem,
  FormHelperText
} from '@material-ui/core';
import { observer } from 'mobx-react';
import { orderBy } from 'lodash';

import Dialog from '@material-ui/core/Dialog';
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
import { learningItemTypesObj, activityTypesObj } from '/imports/activityTypes';
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
import ApiForm from '../GraphEditor/SidePanel/ApiForm';
import Revisions from './Revisions';

const genericDoc = connection.get('li');
export const dataFn = generateReactiveFn(genericDoc, LI);
const LearningItem = dataFn.LearningItem;

const editableLIs = values(learningItemTypesObj).filter(
  x => (x.Editor && x.liDataStructure) || x.Creator
);

type WikiCompPropsT = {
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
  pageId: ?string,
  pageTitle: ?string,
  pageTitleString: ?string,
  mode: string,
  docMode: string,
  editingTitle: boolean,
  liType: string,
  newTitle: string,
  error: ?string,
  openCreator: ?Object,
  showTitleEditButton: boolean,
  wikiContext: Object,
  pageLiType: ?string
};

class WikiComp extends Component<WikiCompPropsT, WikiCompStateT> {
  wikiId: string = this.props.match.params.wikiId;
  
  wikiDoc: Object = {};

  config: Object = {};

  constructor(props) {
    super(props);
    if (!this.wikiId) throw new Error('Empty wikiId field');

    this.state = {
      dashboardOpen: false,
      pageId: null,
      pageTitle: this.props.match.params.pageTitle
        ? this.props.match.params.pageTitle.toLowerCase()
        : null,
      pageTitleString: this.props.match.params.pageTitle
        ? this.props.match.params.pageTitle.toLowerCase()
        : null,
      mode: 'document',
      docMode: 'view',
      editingTitle: false,
      data: [],
      liType: 'li-richText',
      newTitle: '',
      error: null,
      openCreator: false,
      showTitleEditButton: false,
      pageLiType: null,
      wikiContext: {
        getWikiId: this.getWikiId,
        getWikiPages: this.getWikiPages,
        getOnlyValidWikiPages: this.getOnlyValidWikiPages,
        createPage: this.createNewPageLI
      }
    };
  }

  createActivityPage = () => {
    const { activityType, config, invalid } = this.config;
    if (invalid) {
      return window.alert('Cannot create page from invalid configuration');
    }
    const id = uuid();
    const doc = connection.get('rz', id + '/all');
    doc.create(activityTypesObj[activityType].dataStructure);
    const payload = {
      acType: activityType,
      activityData: { config },
      rz: id + '/all',
      title: this.state.newTitle,
      activityTypeTitle: activityTypesObj[activityType].meta.name
    };

    const newId = dataFn.createLearningItem('li-activity', payload, {
      title: this.state.newTitle
    });

    addNewWikiPage(this.wikiDoc, newId, this.state.newTitle, 'li-activity');
    this.setState({
      mode: 'document'
    });
  };

  WikiLink = observer(({ data }) => {
    const pageObj = wikistore.pages[data.id];
    const pageTitle = pageObj.title;
    const style = {
      textDecoration: 'underline',
      cursor: 'pointer',
      color: 'black'
    };
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
        {pageTitle}
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
    if (pageTitle != null) {
      const pageId = parsedPages[pageTitle].id;

      this.setState({
        pageId,
        pageTitle,
        pageTitleString: pageTitle,
        pageLiType: parsedPages[pageTitle].liType,
        docMode:
          parsedPages[pageTitle].liType === 'li-activity'
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
      const pages = parseDocResults(this.wikiDoc.data);
      const newPageTitle = this.props.match.params.pageTitle;
      if (!newPageTitle) return;

      if (!pages[newPageTitle]) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState(
          {
            pageId: null,
            pageTitle: newPageTitle,
            pageTitleString: newPageTitle,
            pageLiType: pages[newPageTitle].liType,
            docMode:
              pages[newPageTitle].liType === 'li-activity' ? 'edit' : 'view'
          },
          () => {
            this.createNewPageLI(newPageTitle);
          }
        );

        return;
      }

      const pageId = pages[newPageTitle].id;

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        pageId,
        mode: 'document',
        liType: 'li-richText',
        pageTitle: newPageTitle,
        pageTitleString: newPageTitle,
        docMode: pages[newPageTitle].liType === 'li-activity' ? 'edit' : 'view',
        pageLiType: pages[newPageTitle].liType
      });
    }
  }

  createNewPageLI = (pageTitleRaw: string, liType: ?string) => {
    if (!pageTitleRaw) throw new Error('Empty pageTitleRaw');
    const pageTitle = pageTitleRaw.toLowerCase();
    const meta = {
      wikiId: this.wikiId
    };

    if (learningItemTypesObj[liType || 'li-richText'].Creator) {
      this.setState({
        openCreator: {
          type: liType,
          callback: newId => {
            addNewWikiPage(this.wikiDoc, newId, pageTitle, liType);
            this.setState({ openCreator: false });
          }
        }
      });
    } else {
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
    }
  };

  createLI = () => {
    const newTitle = this.state.newTitle;
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

    if (this.state.mode === 'api') {
      this.createActivityPage();
    } else {
      this.createNewPageLI(this.state.newTitle, this.state.liType);
    }
    const link = '/wiki/' + this.wikiId + '/' + this.state.newTitle;
    this.props.history.push(link);

    this.setState({
      newTitle: '',
      error: null
    });
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
        editingTitle: false
      },
      () => {
        const link = '/wiki/' + this.wikiId + '/' + newPageTitle;
        this.props.history.replace(link);
      }
    );
  };

  render() {
    if (!this.state.pageId || !this.state.pageTitle) return null;

    const errorDiv = this.state.error ? (
      <div>
        <p style={{ color: 'red' }}>Error: {this.state.error}</p>
      </div>
    ) : null;

    const validPages = this.getOnlyValidWikiPages();
    const pagesLinks = orderBy(validPages, 'title').map(pageObj => {
      const pageId = pageObj.id;
      const pageTitle = pageObj.title;

      const link = '/wiki/' + this.wikiId + '/' + pageTitle;

      const currentPageBool = pageId === this.state.pageId;

      const style = currentPageBool
        ? {
            color: 'blue',
            cursor: 'pointer'
          }
        : {
            cursor: 'pointer'
          };
      return (
        <li key={pageId} style={{ fontSize: '14px' }}>
          <span
            onClick={e => {
              e.preventDefault();
              this.props.history.push(link);
            }}
            style={style}
          >
            {pageTitle}
          </span>
        </li>
      );
    });

    const newPageListItem = (
      <>
        <br />
        <li>
          <input
            placeholder="New LI Title"
            value={this.state.newTitle}
            onChange={e => {
              this.setState({ newTitle: e.target.value });
            }}
          />
          <button onClick={this.createLI}>+</button>
          <br />
          <FormControl>
            <Select
              value={this.state.liType}
              onChange={e => this.setState({ liType: e.target.value })}
              displayEmpty
              name="liType"
            >
              {editableLIs.map(x => (
                <MenuItem key={x.id} value={x.id}>
                  {x.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Learning Item type</FormHelperText>
          </FormControl>
          {errorDiv}
          <A
            onClick={() =>
              this.setState({
                mode: this.state.mode === 'api' ? 'document' : 'api'
              })
            }
          >
            Use FROG activity type
          </A>
        </li>
      </>
    );

    const containerDivStyle = {
      display: 'flex',
      height: '100vh',
      width: '100%'
    };

    const sideNavBarStyle = {
      width: '250px',
      backgroundColor: 'lightgrey',
      padding: '10px',
      borderRight: '1px grey solid'
    };

    const contentDivStyle = {
      flex: 'auto',
      height: '100vh',
      width: 'calc(100vw - 250px)'
    };

    const titleDivStyle = {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      height: '40px',
      fontSize: '30px'
    };

    const titleDiv = this.state.editingTitle ? (
      <div style={titleDivStyle}>
        <input
          placeholder="New Title"
          value={this.state.pageTitleString}
          onChange={e => {
            this.setState({ pageTitleString: e.target.value });
          }}
        />
        <Check onClick={() => this.saveNewPageTitle()} />
      </div>
    ) : (
      <div
        style={titleDivStyle}
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
    );

    const sideNavBar = (
      <div style={sideNavBarStyle}>
        <h2>{this.wikiId}</h2>
        <ul>
          {newPageListItem}
          <hr />
          {pagesLinks}
        </ul>
      </div>
    );

    const topNavBarStyle = {
      display: 'flex',
      widht: '100%',
      backgroundColor: 'lightgrey'
    };

    const topNavBarItemWidth = validPages.length > 1 ? '20%' : '25%';

    const topNavBarItemStyle = {
      display: 'inline-flex',
      width: topNavBarItemWidth,
      alignItems: 'center',
      justifyContent: 'center',
      height: '30px',
      fontSize: '14px',
      cursor: 'pointer',
      padding: '22px 0'
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

    const docModeButton = (() => {
      if (
        this.state.docMode === 'history' ||
        this.state.pageLiType === 'li-activity'
      )
        return null;
      if (this.state.docMode === 'view')
        return (
          <button
            onClick={() => {
              this.setState({ docMode: 'edit' });
            }}
          >
            Edit
          </button>
        );
      return (
        <button
          onClick={() => {
            this.setState({ docMode: 'view' });
          }}
        >
          Finish
        </button>
      );
    })();

    return (
      <div>
        <WikiContext.Provider value={this.state.wikiContext}>
          <div style={containerDivStyle}>
            {sideNavBar}
            <div style={contentDivStyle}>
              {topNavBar}
              {this.state.mode === 'api' && (
                <ApiForm
                  noOffset
                  showDelete
                  onConfigChange={e => (this.config = e)}
                />
              )}
              {this.state.mode === 'revisions' && (
                <Revisions doc={this.state.pageId} />
              )}
              {this.state.mode === 'dashboard' && (
                <LIDashboard
                  wikiId={this.wikiId}
                  onClick={page => {
                    this.props.history.push(`/wiki/${this.wikiId}/${page}`);
                    this.setState({ mode: 'document', docMode: 'view' });
                  }}
                />
              )}
              {this.state.mode === 'document' && (
                <Paper style={{ height: 'calc(100% - 100px)' }}>
                  {titleDiv}
                  {docModeButton}
                  <LearningItem
                    type={this.state.docMode}
                    id={this.state.pageId}
                  />
                </Paper>
              )}
            </div>
          </div>
          {this.state.openCreator && (
            <Dialog open onClose={() => this.setState({ openCreator: false })}>
              <LearningItem
                type="create"
                meta={{
                  wikiId: this.wikiId,
                  title: this.state.openCreator.title
                }}
                liType={this.state.openCreator.type}
                onCreate={this.state.openCreator.callback}
              />
            </Dialog>
          )}
        </WikiContext.Provider>
      </div>
    );
  }
}

const Wiki = withRouter(WikiComp);
Wiki.displayName = 'Wiki';

export default Wiki;
