// @flow

import * as React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { WikiContext, values } from 'frog-utils';
import LIDashboard from '../Dashboard/LIDashboard';
import {
  FormControl,
  Select,
  MenuItem,
  FormHelperText
} from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import { connection } from '../App/connection';
import { generateReactiveFn } from '/imports/api/generateReactiveFn';
import LI from '../LearningItem';
import { learningItemTypesObj } from '/imports/activityTypes';
import { parseDocResults, parseSearch } from './helpers';
import {
  addNewWikiPage,
  invalidateWikiPage,
  changeWikiPageTitle
} from '/imports/api/wikiDocAPI';

const genericDoc = connection.get('li');
const dataFn = generateReactiveFn(genericDoc, LI);
const LearningItem = dataFn.LearningItem;

type WikiCompPropsT = {
  match: {
    params: {
      wikiId: string,
      pageTitle: ?string
    }
  }
};

const editableLIs = values(learningItemTypesObj).filter(
  x => (x.Editor && x.dataStructure) || x.Creator
);

class WikiComp extends React.Component<WikiCompPropsT> {
  constructor(props) {
    super(props);

    this.wikiId = this.props.match.params.wikiId;
    if (!this.wikiId) throw new Error('Empty wikiId field');

    const pageTitle = this.props.match.params.pageTitle
      ? this.props.match.params.pageTitle.toLowerCase()
      : null;

    const searchAttributes = parseSearch(props.history.location.search);

    this.state = {
      pages: {},
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
      wikiContext: { getWikiPages: this.getWikiPages }
    };
  }

  WikiLink = ({ title }) => {
    const link = '/wiki/' + this.wikiId + '/' + title;
    const linkFn = e => {
      e.preventDefault();
      this.props.history.push(link);
    };
    return (
      <div
        style={{
          color: this.state.pages[title]?.valid ? '#000000' : '#ff0000',
          textDecoration: 'underline'
        }}
      >
        <span onClick={linkFn}>{title}</span>
      </div>
    );
  };

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

    const pages = parseDocResults(this.wikiDoc.data);
    const pageTitle =
      this.state.pageTitle ||
      (Object.keys(pages).length > 0 && Object.keys(pages)[0]) ||
      'unnamed';

    if (!pages[pageTitle]) {
      this.createNewPageLI(pageTitle);
      return;
    }

    const pageId = pages[pageTitle].id;
    this.setState({
      pages,
      pageId,
      pageTitle,
      pageTitleString: pageTitle
    });
  };

  getWikiPages = () => {
    return values(this.state.pages).map(x => {
      return {
        wikiId: this.wikiId,
        liId: x.id,
        title: x.title,
        created: x.created,
        valid: x.valid
      };
    });
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.match.params.pageTitle !== this.props.match.params.pageTitle
    ) {
      const newPageTitle = this.props.match.params.pageTitle;
      if (!this.state.pages[newPageTitle]) {
        this.createNewPageLI(newPageTitle);
        return;
      }

      const pageId = this.state.pages[newPageTitle].id;

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
    }
  };

  createLI = () => {
    const newTitle = this.state.newTitle;
    if (newTitle === '') {
      this.setState({
        error: 'Title cannot be empty'
      });
      return;
    } else if (this.state.pages[newTitle]) {
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
    const LIdoc = connection.get('li', pageId);
    const LIdataFn = generateReactiveFn(LIdoc, LI);
    LIdataFn.objReplace(false, true, 'deleted');

    invalidateWikiPage(this.wikiDoc, pageId);
  };

  handleEditingTitle = () => {
    this.setState(prevState => ({
      editingTitle: !prevState.editingTitle
    }));
  };

  saveNewPageTitle = () => {
    const newPageTitle = this.state.pageTitleString;
    const LIdoc = connection.get('li', this.state.pageId);
    const LIdataFn = generateReactiveFn(LIdoc, LI);
    LIdataFn.objReplace(this.state.pageTitle, newPageTitle, 'title');

    changeWikiPageTitle(
      this.wikiDoc,
      this.state.pageId,
      this.state.pageTitle,
      newPageTitle
    );

    const query = {
      wikiId: this.wikiId,
      deleted: { $ne: true }
    };

    connection.createFetchQuery('li', query, null, (err, results) => {
      if (err) throw err;
      const pages = parseDocResults(results);
      this.setState(
        {
          pages,
          pageTitle: newPageTitle,
          editingTitle: false
        },
        () => {
          const link = '/wiki/' + this.wikiId + '/' + newPageTitle;
          this.props.history.replace(link);
        }
      );
    });
  };

  render() {
    if (!this.state.pageId || !this.state.pageTitle) return null;

    const errorDiv = this.state.error ? (
      <div>
        <p style={{ color: 'red' }}>Error: {this.state.error}</p>
      </div>
    ) : null;

    const validPages = values(this.state.pages).filter(
      pageObj => pageObj.valid
    );

    const pagesLinks = validPages.map(pageObj => {
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

    const pageDiv = (() => {
      const type = this.state.mode;

      return <LearningItem type={type} id={this.state.pageId} />;
    })();

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
                  {pageDiv}
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
