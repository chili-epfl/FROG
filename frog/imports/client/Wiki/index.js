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

import Dialog from '@material-ui/core/Dialog';
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

const genericDoc = connection.get('li');
const dataFn = generateReactiveFn(genericDoc, LI);
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
  }
};

class WikiComp extends Component<WikiCompPropsT> {
  wikiDoc: ?Object = null;

  wikiId: ?string = null;

  constructor(props) {
    super(props);
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
      wikiContext: {
        getWikiId: this.getWikiId,
        getWikiPages: this.getWikiPages,
        getOnlyValidWikiPages: this.getOnlyValidWikiPages,
        createPage: this.createNewPageLI
      }
    };

    this.wikiId = this.props.match.params.wikiId;
    if (!this.wikiId) throw new Error('Empty wikiId field');
  }

  createActivityPage = (item: Object, config: Object) => {
    const id = uuid();
    const doc = connection.get('rz', id + '/all');
    doc.create(activityTypesObj[item.activityType].dataStructure);
    const payload = {
      acType: item.activityType,
      activityData: { config },
      rz: id + '/all',
      title: this.state.newTitle,
      activityTypeTitle: activityTypesObj[item.activityType].meta.name
    };

    const newId = dataFn.createLearningItem('li-activity', payload, {
      title: this.state.newTitle
    });

    addNewWikiPage(this.wikiDoc, newId, this.state.newTitle);
    this.setState({ openApiform: false });
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
    if (!this.wikiDoc) throw new Error('wikiDoc should not be null!');
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
    console.log(parsedPages);
    const pageTitle = getPageTitle(parsedPages, this.state.pageTitle);
    console.log(pageTitle);
    if (pageTitle != null) {
      const pageId = parsedPages[pageTitle].id;

      this.setState(
        {
          pageId,
          pageTitle,
          pageTitleString: pageTitle
        },
        () => {
          const link = '/wiki/' + this.wikiId + '/' + pageTitle;
          this.props.history.replace(link);
        }
      );
    } else {
      this.createNewPageLI('unnamed');
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
      console.log(this.props.match.params);
      const pages = parseDocResults(this.wikiDoc.data);
      const newPageTitle = this.props.match.params.pageTitle;
      if (!newPageTitle) return;

      if (!pages[newPageTitle]) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState(
          {
            pageId: null,
            pageTitle: newPageTitle,
            pageTitleString: newPageTitle
          },
          () => {
            this.createNewPageLI(newPageTitle);
          }
        );

        return;
      }

      const pageId = pages[newPageTitle].id;
      console.log(pageId);
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        pageId,
        mode: 'document',
        liType: 'li-richText',
        pageTitle: newPageTitle,
        pageTitleString: newPageTitle
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
            addNewWikiPage(this.wikiDoc, newId, pageTitle);
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

      addNewWikiPage(this.wikiDoc, newId, pageTitle);
      return newId;
    }
  };

  createLI = () => {
    const newTitle = this.state.newTitle;
    const parsedPages = parseDocResults(this.wikiDoc.data.pages);
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

    this.createNewPageLI(this.state.newTitle, this.state.liType);

    this.setState({
      newTitle: '',
      error: null
    });
  };

  deleteLI = (pageId: string) => {
    console.log('deleting', pageId);
    const parsedPages = parseDocResults(this.wikiDoc.data);
    const newPageTitle = getPageTitle(parsedPages, null, pageId);
    console.log(newPageTitle);
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
    const pagesLinks = validPages.map(pageObj => {
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
              this.setState({ openApiform: !this.state.openApiform })
            }
          >
            Use FROG activity type
          </A>
        </li>
      </>
    );

    const containerDivStyle = {
      display: 'flex',
      minHeight: '100vh',
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
      height: '100%'
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
        <Check onClick={() => this.saveNewPageTitle(this.state.pageId)} />
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
          {pagesLinks}
          {newPageListItem}
        </ul>
      </div>
    );

    const topNavBarStyle = {
      display: 'flex',
      widht: '100%',
      backgroundColor: 'lightgrey'
    };

    const topNavBarLeftItemStyle = {
      display: 'inline-flex',
      width: '30%',
      alignItems: 'center',
      justifyContent: 'center',
      height: '30px',
      fontSize: '14px',
      cursor: 'pointer',
      padding: '20px 0'
    };

    const topNavBarCenterItemStyle = {
      display: 'inline-flex',
      width: '30%',
      margin: '0 10%',
      alignItems: 'center',
      justifyContent: 'center',
      height: '30px',
      fontSize: '14px',
      cursor: 'pointer',
      padding: '20px 0'
    };

    const topNavBarRightItemStyle = {
      display: 'inline-flex',
      width: '30%',
      alignItems: 'center',
      justifyContent: 'center',
      height: '30px',
      fontSize: '14px',
      cursor: 'pointer',
      padding: '20px 0'
    };

    const iconButtonStyle = {
      marginRight: '5px'
    };

    const pageItemColor =
      this.state.mode === 'document' && this.state.docMode === 'view'
        ? 'secondary'
        : 'primary';
    const historyItemColor =
      this.state.mode === 'document' && this.state.docMode === 'history'
        ? 'secondary'
        : 'primary';
    const dashboardItemColor =
      this.state.mode === 'dashboard' ? 'secondary' : 'primary';

    const topNavBar = (
      <div style={topNavBarStyle}>
        <div
          style={topNavBarLeftItemStyle}
          onClick={() => {
            this.setState({ mode: 'document', docMode: 'view' });
          }}
        >
          <ChromeReaderMode style={iconButtonStyle} color={pageItemColor} />
          <span stlye={{ color: pageItemColor }}>Page</span>
        </div>
        <div
          style={topNavBarCenterItemStyle}
          onClick={() => {
            this.setState({ mode: 'document', docMode: 'history' });
          }}
        >
          <History style={iconButtonStyle} color={historyItemColor} />
          <span stlye={{ color: historyItemColor }}>History</span>
        </div>
        <div
          style={topNavBarRightItemStyle}
          onClick={() => {
            this.setState({ mode: 'dashboard' });
          }}
        >
          <div style={{ marginRight: '40px' }}>
            {this.state.pageId && (
              <Delete onClick={() => this.deleteLI(this.state.pageId)} />
            )}
            Delete page{' '}
          </div>
          <Dashboard style={iconButtonStyle} color={dashboardItemColor} />
          <span style={{ color: dashboardItemColor }}>Dashboard</span>
        </div>
      </div>
    );

    const docModeButton = (() => {
      if (this.state.docMode === 'history') return null;
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
                  showSubmit
                  onSubmit={this.createActivityPage}
                />
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
                <>
                  {titleDiv}
                  {docModeButton}
                  <LearningItem
                    type={this.state.docMode}
                    id={this.state.pageId}
                  />
                </>
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
