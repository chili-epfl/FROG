// @flow
import React, { Component } from 'react';

import { collectGraphs, importGraph } from '/imports/api/remoteGraphs';
import LibraryListComponent from '../SidePanel/LibraryListComponent';

const myFilter = (list: Array<any>, searchStr: string) =>
  list
    .filter(
      x =>
        x.title.toLowerCase().includes(searchStr) ||
        x.description.toLowerCase().includes(searchStr) ||
        x.tags.find(y => y.toLowerCase().includes(searchStr)) !== undefined
    )
    .sort((x: Object, y: Object) => (x.title < y.title ? -1 : 1));

class GraphLibrary extends Component<Object> {
  componentWillMount() {
    this.props.setImportList([]);
    collectGraphs()
    .then(e =>
      e.forEach(x => this.props.setImportList([...this.props.importList, x]))
    );
  }

  componentWillUnmount() {
    this.props.setImportList([]);
  }

  render() {
    const { searchStr } = this.props;

    // const select = (activity: Object) => {
    //   addActivity(
    //     activity.activity_type,
    //     activity.config,
    //     activityId,
    //     activity.parent_id,
    //     activity.uuid
    //   );
    //   store.addHistory();
    // };
    return (
        <div
          className="list-group"
          style={{
            height: '93%',
            width: '100%',
            overflowY: 'scroll',
            transform: 'translateY(10px)'
          }}
        >
          {myFilter(this.props.importList, searchStr).length === 0 ? (
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
            myFilter(this.props.importList, searchStr).map((x: Object) => (
              <LibraryListComponent
                onSelect={() => {importGraph(x.uuid);this.props.setModal(false)}}
                object={x}
                key={x.uuid}
                searchS={searchStr}
                eventKey={x.uuid}
                setDelete={this.props.setDelete}
                setIdRemove={this.props.setIdRemove}
              />
            ))
          )}
        </div>
    );
  }
}

export default GraphLibrary;
