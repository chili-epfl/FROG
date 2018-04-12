// @flow
import React, { Component } from 'react';

import { importGraph, collectGraphs } from '/imports/api/remoteGraphs';
import { collectActivities } from '/imports/api/remoteActivities';
import { addActivity } from '/imports/api/activities';
import LibraryListComponent from './LibraryListComponent';

const myFilter = (list: Array<any>, searchStr: string) =>
  list &&
  list
    .filter(
      x =>
        (x.activity_type &&
          x.activity_type.toLowerCase().includes(searchStr.toLowerCase())) ||
        x.title.toLowerCase().includes(searchStr.toLowerCase()) ||
        x.description.toLowerCase().includes(searchStr.toLowerCase()) ||
        x.tags.find(y => y.toLowerCase().includes(searchStr.toLowerCase())) !==
          undefined
    )
    .sort((x: Object, y: Object) => (x.title < y.title ? -1 : 1));

class Library extends Component<Object, { searchStr: string }> {
  constructor(props: Object) {
    super(props);
    this.state = { searchStr: '' };
  }

  componentWillMount() {
    if (
      this.props.libraryType === 'activity' &&
      new Date().getTime() - this.props.lastRefreshAct > 600000
    )
      collectActivities().then(this.props.setImportActivityList);
    else if (
      this.props.libraryType === 'graph' &&
      new Date().getTime() - this.props.lastRefreshGraph > 600000
    )
      collectGraphs().then(this.props.setImportGraphList);
  }

  render() {
    const {
      setDelete,
      setIdRemove,
      activityId,
      libraryType,
      store
    } = this.props;
    const list =
      libraryType === 'activity'
        ? this.props.importActivityList
        : this.props.importGraphList;
    const filtered = myFilter(list, this.state.searchStr);

    const onClick = () => {
      if (this.props.libraryType === 'activity')
        collectActivities().then(this.props.setImportActivityList);
      else if (this.props.libraryType === 'graph')
        this.props.setImportGraphList([]);
      collectGraphs().then(this.props.setImportGraphList);
    };

    return (
      <div className="bootstrap">
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div className="input-group">
            <span className="input-group-addon" id="basic-addon1">
              <span className="glyphicon glyphicon-search" aria-hidden="true" />
            </span>
            <input
              type="text"
              value={this.state.searchStr}
              style={{ zIndex: 0 }}
              onChange={e => this.setState({ searchStr: e.target.value })}
              className="form-control"
              placeholder="Search for..."
              aria-describedby="basic-addon1"
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={onClick}>
            <span className="glyphicon glyphicon-repeat" />
          </button>
        </div>
        <div
          className="list-group"
          style={{
            height: '93%',
            width: '100%',
            overflowY: 'scroll',
            transform: 'translateY(10px)'
          }}
        >
          {filtered && filtered.length === 0 ? (
            <div
              style={{
                marginTop: '20px',
                marginLeft: '10px',
                fontSize: '40px'
              }}
            >
              No result
            </div>
          ) : (
            filtered &&
            filtered.map((x: Object) => (
              <LibraryListComponent
                onSelect={() => {
                  if (libraryType === 'activity') {
                    // broken
                    addActivity(
                      x.activity_type,
                      x.config,
                      activityId,
                      null,
                      x.uuid
                    );
                    store.addHistory();
                  } else if (libraryType === 'graph') {
                    importGraph(x.uuid);
                    this.props.setModal(false);
                  }
                }}
                object={x}
                key={x.uuid}
                onPreview={() =>
                  store.ui.setShowPreview({
                    activityTypeId: x.activity_type,
                    config: x.config
                  })
                }
                eventKey={x.uuid}
                searchStr={this.state.searchStr}
                {...{ setDelete, setIdRemove }}
              />
            ))
          )}
        </div>
      </div>
    );
  }
}

export default Library;
