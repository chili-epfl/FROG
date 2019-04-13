// @flow

import * as React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { WikiContext, values } from 'frog-utils';
import {
  FormControl,
  Select,
  MenuItem,
  FormHelperText
} from '@material-ui/core';
import { observer } from 'mobx-react';

import Dialog from '@material-ui/core/Dialog';
import { connection } from '../App/connection';
import { generateReactiveFn } from '/imports/api/generateReactiveFn';
import LI from '../LearningItem';
import { learningItemTypesObj } from '/imports/activityTypes';
import {
  parseDocResults,
  parseSearch,
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

const genericDoc = connection.get('li');
const dataFn = generateReactiveFn(genericDoc, LI);
const LearningItem = dataFn.LearningItem;

const editableLIs = values(learningItemTypesObj).filter(
  x => (x.Editor && x.dataStructure) || x.Creator
);

type WikiCompPropsT = {
  match: {
    params: {
      wikiId: string,
      pageTitle: ?string
    }
  }
};

class WikiComp extends React.Component<WikiCompPropsT> {
  constructor(props) {
    super(props);

    this.initialLoad = true;
    this.wikiId = this.props.match.params.wikiId;
    if (!this.wikiId) throw new Error('Empty wikiId field');

    const pageTitle = this.props.match.params.pageTitle
      ? this.props.match.params.pageTitle.toLowerCase()
      : null;

    const searchAttributes = parseSearch(props.history.location.search);

    this.state = {
      dashboardOpen: searchAttributes.dashboard === 'true',
      pageId: null,
      pageTitle,
      pageTitleString: pageTitle,
      mode: 'view',
      editingTitle: false,
      data: [],
      liType: 'li-richText',
      newTitle: '',
      error: null,
      wikiContext: {
        getWikiId: this.getWikiId,
        getWikiPages: this.getWikiPages,
        getOnlyValidWikiPages: this.getOnlyValidWikiPages,
        createPage: this.createNewPageLI
      }
    };
  }

  WikiLink = observer(({ data }) => {
    const pageObj = data.id ? wikistore.pages[data.id] : null;
    const pageTitle = pageObj ? pageObj.title : data.title;
    const style = {
      textDecoration: 'underline',
      cursor: 'pointer'
    };
    const link = '/wiki/' + this.wikiId + '/' + pageTitle;
    const linkFn = e => {
      e.preventDefault();
      this.props.history.push(link);
    };

    if (!data.id) {
      style.color = 'green';
      return (
        <span onClick={linkFn} style={style}>
          {pageTitle}
        </span>
      )
    }

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

    if (!parsedPages[pageTitle]) {
      if (this.initialLoad) {
        this.initialLoad = false;
        this.createNewPageLI(pageTitle);
      }
      return;
    }
    this.initialLoad = false;

    const pageId = parsedPages[pageTitle].id;

    this.setState({
      pageId,
      pageTitle,
      pageTitleString: pageTitle
    });
  };

  getWikiId = () => {
    return this.wikiId;
  }

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
      prevProps.match.params.pageTitle !== this.props.match.params.pageTitle
    ) {
      const pages = parseDocResults(this.wikiDoc.data);
      const newPageTitle = this.props.match.params.pageTitle;
      if (!pages[newPageTitle]) {
        this.setState({
          pageId: null,
          pageTitle: newPageTitle,
          pageTitleString: newPageTitle,
        }, () => {
          this.createNewPageLI(newPageTitle);
        });
        
        return;
      }

      const pageId = pages[newPageTitle].id;

      this.setState({
        pageId,
        mode: 'view',
        liType: 'li-richText',
        dashboardOpen: false,
        pageTitle: newPageTitle,
        pageTitleString: newPageTitle
      });
    }
  }

  createNewPageLI = (pageTitleRaw, liType) => {
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

  deleteLI = pageId => {
    // const LIdoc = connection.get('li', pageId);
    // const LIdataFn = generateReactiveFn(LIdoc, LI);
    // LIdataFn.objReplace(false, true, 'deleted');

    invalidateWikiPage(this.wikiDoc, pageId);
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

    const pagesLinks = this.getOnlyValidWikiPages().map(pageObj => {
      const pageId = pageObj.id;
      const pageTitle = pageObj.title;

      const link = '/wiki/' + this.wikiId + '/' + pageTitle;

      const currentPageBool = pageId === this.state.pageId;
      const style = currentPageBool
        ? {
            fontWeight: 'bold'
          }
        : {};
      return (
        <li key={pageId} style={style}>
          <Link to={link}>{pageTitle}</Link>
          {currentPageBool ? null : (
            <button onClick={() => this.deleteLI(pageId)}>X</button>
          )}
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
              name="age"
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
        </li>
      </>
    );

    const containerDivStyle = {
      display: 'table',
      minHeight: '100vh',
      width: '100%'
    };

    const pagesLinksDivStyle = {
      display: 'table-cell',
      width: '250px',
      backgroundColor: 'lightgrey',
      padding: '5px'
    };

    const contentDivStyle = {
      display: 'table-cell',
      padding: '5px'
    };

    const titleDiv = (() => {
      const titleDisplay = this.state.editingTitle ? (
        <div>
          <input
            placeholder="New Title"
            value={this.state.pageTitleString}
            onChange={e => {
              this.setState({ pageTitleString: e.target.value });
            }}
          />
          <button onClick={() => this.saveNewPageTitle(this.state.pageId)}>
            Save
          </button>
        </div>
      ) : (
        <h1>{this.state.pageTitle}</h1>
      );
      const editButton = this.state.editingTitle ? null : (
        <button onClick={this.handleEditingTitle}>Edit Title</button>
      );
      return (
        <div>
          {titleDisplay}
          {editButton}
        </div>
      );
    })();

    return (
      <div>
        <WikiContext.Provider value={this.state.wikiContext}>
          <div style={containerDivStyle}>
            <div style={pagesLinksDivStyle}>
              <h2>Wiki: {this.wikiId}</h2>
              <ul>
                {this.state.dashboardOpen ? (
                  <button
                    onClick={() => {
                      this.props.history.push(
                        `/wiki/${this.wikiId}/${this.state.pageTitle}`
                      );
                      this.setState({ dashboardOpen: false });
                    }}
                  >
                    Close dashboard
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      this.props.history.push(
                        `/wiki/${this.wikiId}/${
                          this.state.pageTitle
                        }?dashboard=true`
                      );
                      this.setState({ dashboardOpen: true });
                    }}
                  >
                    Open Dashboard
                  </button>
                )}
                {pagesLinks}
                {newPageListItem}
              </ul>
            </div>
            <div style={contentDivStyle}>
              {this.state.dashboardOpen ? (
                <LIDashboard
                  wikiId={this.wikiId}
                  onClick={page => {
                    this.props.history.push(`/wiki/${this.wikiId}/${page}`);
                    this.setState({ dashboardOpen: false });
                  }}
                />
              ) : (
                <>
                  {titleDiv}
                  <div>
                    {this.state.mode === 'view' ? (
                      <>
                        <button
                          onClick={() => {
                            this.setState({ mode: 'edit' });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            this.setState({ mode: 'history' });
                          }}
                        >
                          Show History
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          this.setState({ mode: 'view' });
                        }}
                      >
                        Close
                      </button>
                    )}
                  </div>
                  <LearningItem type={this.state.mode} id={this.state.pageId} />
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
