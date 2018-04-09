// @flow
import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

import { collectGraphs, importGraph } from '/imports/api/remoteGraphs';
import { collectActivities } from '/imports/api/remoteActivities';
import { addActivity } from '/imports/api/activities';
import LibraryListComponent from './LibraryListComponent';


const myFilter = (list: Array<any>, searchStr: string) =>
  list
    .filter(
      x =>
        (x.activity_type &&
          x.activity_type.toLowerCase().includes(searchStr)) ||
        x.title.toLowerCase().includes(searchStr) ||
        x.description.toLowerCase().includes(searchStr) ||
        x.tags.find(y => y.toLowerCase().includes(searchStr)) !== undefined
    )
    .sort((x: Object, y: Object) => (x.title < y.title ? -1 : 1));

class Library extends Component<Object, {searchStr: string}> {
  constructor(props){
    super(props)
    this.state = {searchStr: ''}
  }

  componentWillMount() {
    this.props.setImportList([]);
    const collect =
      this.props.libraryType === 'activity' ? collectActivities : collectGraphs;
    collect().then(e =>
      e.forEach(x => this.props.setImportList([...this.props.importList, x]))
    );
  }

  componentWillUnmount() {
    this.props.setImportList([]);
  }

  render() {
    const {
      setDelete,
      setIdRemove,
      activityId,
      libraryType,
      store
    } = this.props;
    const list = libraryType === 'activity' ? this.props.importActivityList : this.props.importGraphList
    return (
      <React.Fragment>
      <TextField
        value={this.state.searchStr}
        onChange={e => this.setState({searchStr: e.target.value})}
        id="exampleFormControlTextarea1"
      />
      <div
        className="list-group"
        style={{
          height: '93%',
          width: '100%',
          overflowY: 'scroll',
          transform: 'translateY(10px)'
        }}
      >
        {myFilter(list, this.state.searchStr).length === 0 ? (
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
          myFilter(list, this.state.searchStr).map((x: Object) => (
            <LibraryListComponent
              onSelect={() => {
                if (libraryType === 'activity') {
                  addActivity(
                    x.activity_type,
                    x.config,
                    activityId,
                    x.parent_id,
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
    </React.Fragment>
    );
  }
}

export default Library;
