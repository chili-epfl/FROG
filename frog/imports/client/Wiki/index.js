// @flow

import * as React from 'react';
import { Link } from 'react-router-dom';

import { connection } from '../App/connection';
import { generateReactiveFn } from '/imports/api/generateReactiveFn';
import LI from '../LearningItem';
import { parseDocResults, mapPagesToLIs, parseSearch } from './helpers';

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
    console.log(props);
    this.dataSubscription = null;
    this.needToCreateNewPageLI = false;
    this.wikiId = this.props.match.params.wikiId;
    const pageTitle = this.props.match.params.pageTitle ? this.props.match.params.pageTitle.toLowerCase() : 'home';
    console.log(pageTitle);

    this.state = {
      pages: [],
      pageTitle: pageTitle,
      initialLoad: true,
      editing: true,
      data: [],
      newTitle: '',
      error: null,
    };
  }

  componentDidMount() {
    const query = {
      liType: 'li-richText', 
      wikiId: this.wikiId,
      deleted: false
    }

    this.dataSubscription = connection.createSubscribeQuery(
      'li',
      query, 
      null, 
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          this.processResults(results);
        }
      }
    );

    this.dataSubscription.on('changed', results => this.processResults(results));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.pageTitle !== this.props.match.params.pageTitle) {
      const newPageTitle = this.props.match.params.pageTitle;

      if (!this.state.pages[newPageTitle]) {
        this.createNewPageLI(newPageTitle);
        return;
      }

      this.setState({
        pageTitle: this.props.match.params.pageTitle,
      });
    }
  }

  processResults = (results) => {
    console.log(results);
    const pages = parseDocResults(results);
    console.log(pages);

    if (!pages[this.state.pageTitle]) {
      this.createNewPageLI(this.state.pageTitle);
      return;
    }

    this.setState({
      data: results,
      pages: pages,
    });
  }

  createNewPageLI = (pageTitle) => {
    pageTitle = pageTitle.toLowerCase();
    console.log(pageTitle);
    const meta = {
      wikiId: this.wikiId,
      title: pageTitle,
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

  deleteLI = (id) => {
    const LIdoc = connection.get('li', id);
    const LIdataFn = generateReactiveFn(LIdoc, LI);
    LIdataFn.objReplace(false, true, 'deleted');
  };

  render() {
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
      const style = (pageTitle === this.state.pageTitle) ? {
        fontWeight: 'bold',
      } : {};

      return (
        <li key={doc.id} style={style}>
          <Link to={link}>{doc.title}</Link>
        </li>
      )
    });

    console.log(pagesLinks);

    const newPageListItem = (
      <li>
        <input
          placeholder={"New LI Title"}
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
      const pageObj = this.state.pages[this.state.pageTitle];
      if (!pageObj) return null;

      const pageId = pageObj.id;
      const type = this.state.editing ? 'edit' : 'view';

      return (
        <div>
          <LearningItem type={type} id={pageId} />
        </div>
      )
    })();


    const containerDivStyle = {
      display: 'table',
      minHeight: '100vh',
      width: '100%'
    }


    const pagesLinksDivStyle = {
      display: 'table-cell',
      width: '250px',
      height: '100%',
      backgroundColor: 'lightgrey',
      padding: '5px',
    }

    const contentDivStyle = {
      display: 'table-cell',
      padding: '10px',
    }

    return (
      <div>
        <div style={containerDivStyle}>
          <div style={pagesLinksDivStyle}>
            <h2>
              Wiki: {this.wikiId}
            </h2>
            <h3>
              Page: {this.state.pageTitle}
            </h3>
            <ul>
              {pagesLinks}
              {newPageListItem}
            </ul>
          </div>
          <div style={contentDivStyle}>
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

export default WikiComp;
