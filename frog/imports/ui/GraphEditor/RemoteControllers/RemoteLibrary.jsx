// @flow
import React, { Component } from 'react';

import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import Search from '@material-ui/icons/Search';
import Refresh from '@material-ui/icons/Refresh';

import { LibraryStates } from '/imports/api/cache';
import {
  importGraph,
  collectGraphs,
  checkDateGraph
} from '/imports/api/remoteGraphs';
import {
  collectActivities,
  importAct,
  checkDateAct
} from '/imports/api/remoteActivities';
import ListComponent from '../SidePanel/ListComponent';

const filterWithStr = (list: Array<any>, searchStr: string) =>
  list &&
  list
    .filter(
      x =>
        (x.activity_type &&
          x.activity_type.toLowerCase().includes(searchStr)) ||
        x.title.toLowerCase().includes(searchStr) ||
        x.description.toLowerCase().includes(searchStr) ||
        x.tags.find(y => y.toLowerCase().includes(searchStr)) !== undefined
    )
    .sort((x: Object, y: Object) => {
      if (x.activity_type) return x.title < y.title ? -1 : 1;
      else return x.timestamp > y.timestamp ? -1 : 1;
    });

class Library extends Component<Object, { searchStr: string }> {
  constructor(props: Object) {
    super(props);
    this.state = { searchStr: '' };
  }

  componentWillMount() {
    if (this.props.libraryType === 'activity')
      checkDateAct(() => this.forceUpdate());
    else if (this.props.libraryType === 'graph')
      checkDateGraph(() => this.forceUpdate());
    else if (this.props.locallyChanged) {
      collectActivities(() => collectGraphs(() => this.forceUpdate()));
      this.props.changesLoaded();
    }
  }

  render() {
    const {
      setDelete,
      setIdRemove,
      activityId,
      libraryType,
      searchStr,
      store
    } = this.props;
    const list =
      libraryType === 'activity'
        ? LibraryStates.activityList
        : LibraryStates.graphList;
    const filtered = filterWithStr(
      list,
      searchStr || this.state.searchStr.toLowerCase()
    );
    const onClick = () => {
      if (this.props.libraryType === 'activity') collectActivities();
      else if (this.props.libraryType === 'graph') collectGraphs();
    };
    return (
      <div className="bootstrap">
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {searchStr === undefined && (
            <div
              style={{
                position: 'relative',
                borderRadius: '5px',
                background: 'rgba(0,0,0,.05)'
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '100%',
                  display: 'flex',
                  position: 'absolute',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Search />
              </div>
              <input
                type="text"
                value={this.state.searchStr}
                onChange={e => this.setState({ searchStr: e.target.value })}
                style={{
                  border: '0',
                  width: '100%',
                  padding: '8px 8px 8px 50px',
                  background: 'none',
                  outline: 'none',
                  whiteSpace: 'normal',
                  verticalAlign: 'middle',
                  fontSize: '1rem'
                }}
                aria-describedby="basic-addon1"
              />
            </div>
          )}
          <IconButton aria-label="Refresh" {...onClick}>
            <Refresh />
          </IconButton>
        </div>
        <List
          style={
            this.props.libraryType === 'activity'
              ? { maxHeight: '650px', overflowY: 'scroll' }
              : {}
          }
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
              <ListComponent
                object={{
                  id: x.uuid,
                  meta: {
                    name: x.title,
                    shortDesc: x.description
                  },
                  ...x
                }}
                onSelect={() => {
                  if (libraryType === 'activity') {
                    if (this.props.setActivityTypeId)
                      this.props.setActivityTypeId(x.activity_type);
                    importAct(
                      x.uuid,
                      activityId,
                      () => {
                        store.addHistory();
                        store.refreshValidate();
                      },
                      this.props.onSelect
                    );
                  } else if (libraryType === 'graph') {
                    // setParentId(x.uuid)
                    importGraph(x.uuid);
                    this.props.setModal(false);
                  }
                }}
                key={x.uuid}
                onPreview={() =>
                  store.ui.setShowPreview({
                    activityTypeId: x.activity_type,
                    config: x.config
                  })
                }
                eventKey={x.uuid}
                searchS={searchStr || this.state.searchStr}
                {...{ setDelete, setIdRemove }}
                isLibrary="true"
              />
            ))
          )}
        </List>
      </div>
    );
  }
}

export default Library;
