// @flow

import * as React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { WikiContext } from 'frog-utils'

import { connection } from '../App/connection';
import { generateReactiveFn } from '/imports/api/generateReactiveFn';
import LI from '../LearningItem';
import { parseDocResults } from './helpers';
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

class WikiComp extends React.Component<WikiCompPropsT> {
  constructor(props) {
    super(props);
    window.frog_gotoLink = url => props.history.push(url);
    this.dataSubscription = null;

    this.wikiId = this.props.match.params.wikiId;
    if (!this.wikiId) throw new Error('Empty wikiId field');
    this.wikiDoc = connection.get('wiki', this.wikiId);
    this.wikiDoc.on('create', this.subscribeToPagesData);

    const pageTitle = this.props.match.params.pageTitle
      ? this.props.match.params.pageTitle.toLowerCase()
      : null;

    this.state = {
      pages: [],
      pageId: null,
      pageTitle,
      pageTitleString: pageTitle,
      editing: true,
      editingTitle: false,
      data: [],
      newTitle: '',
      error: null
    };
  }

  componentDidMount() {
    this.wikiDoc.subscribe(err => {
      if (err) throw err;
      this.loadWikiDoc();
    });
  }

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
        pageTitle: newPageTitle,
        pageTitleString: newPageTitle
      });
    }
  }

  loadWikiDoc = () => {
    console.log(this.wikiDoc);

    if (!this.wikiDoc.data) {
      this.wikiDoc.create({ pages: {} });
    } else {
      this.subscribeToPagesData();
    }
  };

  subscribeToPagesData = () => {
    const query = {
      wikiId: this.wikiId,
      deleted: false
    };

    this.dataSubscription = connection.createSubscribeQuery('li', query);
    this.dataSubscription.on('ready', () =>
      this.processResults(this.dataSubscription.results)
    );
    this.dataSubscription.on('changed', results =>
      this.processResults(results)
    );
    this.dataSubscription.on('error', err => {
      throw err;
    });
  };

  processResults = results => {
    console.log(results);

    const pages = parseDocResults(results);
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
      data: results,
      pages,
      pageId,
      pageTitle,
      pageTitleString: pageTitle
    });
  };

  createNewPageLI = pageTitleRaw => {
    const pageTitle = pageTitleRaw.toLowerCase();
    const meta = {
      wikiId: this.wikiId,
      title: pageTitle,
      deleted: false
    };

    const newId = dataFn.createLearningItem(
      'li-richText',
      undefined,
      meta,
      undefined,
      undefined,
      undefined
    );

    addNewWikiPage(this.wikiDoc, newId, pageTitle);
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

    this.createNewPageLI(this.state.newTitle);

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
      deleted: false
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

  getWikiPages=()=> {
    return this.state.pages;
  }

  render() {
    if (!this.state.pageId || !this.state.pageTitle) return null;

    const errorDiv = this.state.error ? (
      <div>
        <p style={{ color: 'red' }}>Error: {this.state.error}</p>
      </div>
    ) : null;

    const pagesLinks = Object.keys(this.state.pages).map(pageTitle => {
      const doc = this.state.pages[pageTitle];

      const link = '/wiki/' + this.wikiId + '/' + pageTitle;

      const currentPageBool = doc.id === this.state.pageId;
      const style = currentPageBool
        ? {
            fontWeight: 'bold'
          }
        : {};

      return (
        <li key={doc.id} style={style}>
          <Link to={link}>{doc.title}</Link>
          {currentPageBool ? null : (
            <button onClick={() => this.deleteLI(doc.id)}>X</button>
          )}
        </li>
      );
    });

    const newPageListItem = (
      <li>
        <input
          placeholder="New LI Title"
          value={this.state.newTitle}
          onChange={e => {
            this.setState({ newTitle: e.target.value });
          }}
        />
        <button onClick={this.createLI}>+</button>
        {errorDiv}
      </li>
    );

    const pageDiv = (() => {
      const type = this.state.editing ? 'edit' : 'view';

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
        <WikiContext.Provider value={{getWikiPages: this.getWikiPages}}>
          <div style={containerDivStyle}>
            <div style={pagesLinksDivStyle}>
              <h2>Wiki: {this.wikiId}</h2>
              <ul>
                {pagesLinks}
                {newPageListItem}
              </ul>
            </div>
            <div style={contentDivStyle}>
              {titleDiv}
              <div>
                <button
                  disabled={!this.state.editing}
                  onClick={() => {
                    this.setState({ editing: false });
                  }}
                >
                  View
                </button>
                <button
                  disabled={this.state.editing}
                  onClick={() => {
                    this.setState({ editing: true });
                  }}
                >
                  Edit
                </button>
              </div>
              {pageDiv}
            </div>
          </div>
        </WikiContext.Provider>
      </div>
    );
  }
}

const Wiki = withRouter(WikiComp);
Wiki.displayName = 'Wiki';

export default Wiki;
