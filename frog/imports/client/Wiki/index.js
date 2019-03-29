// @flow

import * as React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";

import { connection } from '../App/connection';
import { generateReactiveFn } from '/imports/api/generateReactiveFn';
import LI from '../LearningItem';
import { parseDocResults } from './helpers';

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
    window.frog_gotoLink = (url) => props.history.push(url)
    this.dataSubscription = null;
    this.wikiId = this.props.match.params.wikiId;
    const pageTitle = this.props.match.params.pageTitle ? this.props.match.params.pageTitle.toLowerCase() : null;

    this.state = {
      pages: [],
      pageId: null,
      pageTitle,
      pageTitleString: pageTitle,
      editing: true,
      editingTitle: false,
      data: [],
      newTitle: '',
      error: null,
    };
  }

  componentDidMount() {
    const query = {
      wikiId: this.wikiId,
      deleted: false
    }

    this.dataSubscription = connection.createSubscribeQuery('li', query);
    this.dataSubscription.on('ready', () => this.processResults(this.dataSubscription.results));
    this.dataSubscription.on('changed', results => this.processResults(results));
    this.dataSubscription.on('error', err => console.error(err));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.pageTitle !== this.props.match.params.pageTitle) {
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

  processResults = (results) => {
    console.log(results);

    const pages = parseDocResults(results);
    const pageTitle = this.state.pageTitle || (Object.keys(pages).length>0 && Object.keys(pages)[0]) || 'unnamed';

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
      pageTitleString: pageTitle,
    });
  }

  createNewPageLI = (pageTitle) => {
    const meta = {
      wikiId: this.wikiId,
      title: pageTitle.toLowerCase(),
      deleted: false,
    };

    return dataFn.createLearningItem(
      'li-richText',
      undefined,
      meta,
      undefined,
      undefined,
      undefined
    );
  }

  createLI = () => {
    const newTitle = this.state.newTitle;
    if (newTitle === '') {
      this.setState({
        error: 'Title cannot be empty',
      });
      return;
    }
    else if (this.state.pages[newTitle]) {
      this.setState({
        error: 'Title already used',
      });
      return;
    }

    this.createNewPageLI(this.state.newTitle);

    this.setState({
      newTitle: '',
      error: null,
    });
  };

  deleteLI = (pageId) => {
    const LIdoc = connection.get('li', pageId);
    const LIdataFn = generateReactiveFn(LIdoc, LI);
    LIdataFn.objReplace(false, true, 'deleted');
  };

  handleEditingTitle = () => {
    this.setState((prevState) => ({
      editingTitle: !prevState.editingTitle,
    }));
  }

  saveNewPageTitle = () => {
    const newPageTitle = this.state.pageTitleString;
    const LIdoc = connection.get('li', this.state.pageId);
    const LIdataFn = generateReactiveFn(LIdoc, LI);
    LIdataFn.objReplace(null, newPageTitle , 'title');
    
    const query = {
      wikiId: this.wikiId,
      deleted: false
    }

    connection.createFetchQuery('li', query, null, (err, results) => {
      if (err) throw err;
      const pages = parseDocResults(results);
      this.setState({
        pages,
        pageTitle: newPageTitle,
        editingTitle: false,
      }, () => {
        const link = '/wiki/' + this.wikiId + '/' + newPageTitle;
        this.props.history.replace(link);
      })
    }); 
  }

  render() {
    if (!this.state.pageId || !this.state.pageTitle) return null;
    
    const errorDiv = this.state.error ? (
      <div>
        <p style={{color: 'red'}}>
          Error: {this.state.error}
        </p>
      </div>
    ) : null;

    const pagesLinks = Object.keys(this.state.pages).map(pageTitle => {
      const doc = this.state.pages[pageTitle];

      const link = "/wiki/" + this.wikiId + "/" + pageTitle;
      
      const currentPageBool = (doc.id === this.state.pageId)
      const style = currentPageBool ? {
        fontWeight: 'bold',
      } : {};

      return (
        <li key={doc.id} style={style}>
          <Link to={link}>{doc.title}</Link>
          {currentPageBool ? null : (<button onClick={() => this.deleteLI(doc.id)}>X</button>)}
        </li>
      )
    });

    const newPageListItem = (
      <li>
        <input
          placeholder="New LI Title"
          value={this.state.newTitle}
          onChange={(e) => { 
            this.setState({ newTitle: e.target.value });
          }}
        /> 
        <button onClick={this.createLI}>+</button>
        {errorDiv}
      </li>
    )
    

    const pageDiv = (() => {
      const type = this.state.editing ? 'edit' : 'view';

      return (
        <LearningItem type={type} id={this.state.pageId} />
      )
    })();


    const containerDivStyle = {
      display: 'table',
      minHeight: '100vh',
      width: '100%',
    }


    const pagesLinksDivStyle = {
      display: 'table-cell',
      width: '250px',
      backgroundColor: 'lightgrey',
      padding: '5px',
    }

    const contentDivStyle = {
      display: 'table-cell',
      padding: '5px',
    }

    const titleDiv = (() => {
      const titleDisplay = this.state.editingTitle ? (
        <div>
          <input
            placeholder="New Title"
            value={this.state.pageTitleString}
            onChange={(e) => { 
              this.setState({ pageTitleString: e.target.value });
            }}
          />
          <button 
            onClick={() => this.saveNewPageTitle(this.state.pageId)}
          >
            Save
          </button>
        </div>
      ) : (
        <h1>
          {this.state.pageTitle}
        </h1>
      )
      const editButton = this.state.editingTitle ? null : (
        <button 
            onClick={this.handleEditingTitle}
          >
            Edit Title
          </button>
      )
      return (
        <div>
          {titleDisplay}
          {editButton}
        </div>
      )
    })();

    return (
      <div>
        <div style={containerDivStyle}>
          <div style={pagesLinksDivStyle}>
            <h2>
              Wiki: {this.wikiId}
            </h2>
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
                onClick={() => { this.setState({editing: false} )}}
              >
                View
              </button>
              <button 
                disabled={this.state.editing}
                onClick={() => { this.setState({editing: true} )}}
              >
                Edit
              </button>
            </div>
            {pageDiv}
          </div>
        </div>
      </div>
    );
  }
}

const Wiki = withRouter(WikiComp);
Wiki.displayName ='Wiki'

export default Wiki
