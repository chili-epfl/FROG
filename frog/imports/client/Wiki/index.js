// @flow

import * as React from 'react';
import { Link } from 'react-router-dom';
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
import { connection } from '../App/connection';
import { generateReactiveFn } from '/imports/api/generateReactiveFn';
import LI from '../LearningItem';
import { learningItemTypesObj, activityTypesObj } from '/imports/activityTypes';
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

  createActivityPage = (item, config) => {
    const id = uuid();
    const doc = connection.get('rz', id + '/all');
    console.log(
      item,
      config,
      item.activityType,
      activityTypesObj[item.activityType].dataStructure
    );
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

  WikiLink = observer(({ id }) => {
    const pageObj = wikistore.pages[id];
    const pageTitle = pageObj.title;
    const style = {
      textDecoration: 'underline',
      cursor: 'pointer'
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
      prevProps.match.params.pageTitle !== this.props.match.params.pageTitle
    ) {
      const pages = parseDocResults(this.wikiDoc.data);
      const newPageTitle = this.props.match.params.pageTitle;
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

      // eslint-disable-next-line react/no-did-update-set-state
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
      padding: '5px',
      height: '100%'
    };

    const iconButtonStyle = {
      width: '24px'
    };
    const titleDivStyle = {
      display: 'flex',
      alignItems: 'center',
      height: '40px',
      fontSize: '24px',
      marginBottom: '12px'
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
        <Check
          style={iconButtonStyle}
          onClick={() => this.saveNewPageTitle(this.state.pageId)}
        />
      </div>
    ) : (
      <div style={titleDivStyle}>
        <span>{this.state.pageTitle}</span>
        <Edit style={iconButtonStyle} onClick={this.handleEditingTitle} />
      </div>
    );

    const dashboardToggleStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      height: '30px',
      fontSize: '14px',
      cursor: 'pointer'
    };

    const dashboardToggle = (
      <div>
        <div
          style={dashboardToggleStyle}
          onClick={() => {
            if (this.state.dashboardOpen) {
              this.setState({ dashboardOpen: false });
            }
          }}
        >
          <ChromeReaderMode />
          <span>Document</span>
        </div>
        <hr
          style={{
            display: 'inline-block',
            width: '1px',
            height: '20px',
            margin: '0 5px'
          }}
        />
        <div
          style={dashboardToggleStyle}
          onClick={() => {
            if (!this.state.dashboardOpen) {
              this.setState({ dashboardOpen: true });
            }
          }}
        >
          <Dashboard />
          <span>Dashboard</span>
        </div>
      </div>
    );

    return (
      <div>
        <WikiContext.Provider value={this.state.wikiContext}>
          <div style={containerDivStyle}>
            <div style={pagesLinksDivStyle}>
              <h2>Wiki: {this.wikiId}</h2>
              {dashboardToggle}
              <ul>
                {pagesLinks}
                {newPageListItem}
              </ul>
            </div>
            <div style={contentDivStyle}>
              {this.state.openApiform ? (
                <ApiForm
                  noOffset
                  showDelete
                  showSubmit
                  onSubmit={this.createActivityPage}
                />
              ) : this.state.dashboardOpen ? (
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
