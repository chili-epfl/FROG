// @flow
import React, { Component} from 'react';
import PostgREST from 'postgrest-client';

import { addActivity } from '/imports/api/activities';
import {
  ActivityLibrary,
  removeFromLibrary
} from '/imports/api/activityLibrary';
import LibraryListComponent from '../LibraryListComponent';
import Modal from '../ModalDelete';

type StateT = {
  deleteOpen: boolean,
  idRemove: string
};

class Library extends Component<Object, StateT> {
  constructor(props){
    super(props);
    this.state = {
      deleteOpen: false,
      idRemove: ''
    };
    this.Api = new PostgREST('http://icchilisrv4.epfl.ch:5000')
  }

  render(){
    const {
      activityId,
      searchStr,
      store
    } = this.props

    const select = (activity: Object) => {
      addActivity(
        activity.activityType,
        activity.configuration,
        activityId,
        null,
        activity._id
      );
      store.addHistory();
    };

    const filteredList = ActivityLibrary.find()
      .fetch()
      .filter(
        x =>
          x.activityType.toLowerCase().includes(searchStr) ||
          x.title.toLowerCase().includes(searchStr) ||
          x.description.toLowerCase().includes(searchStr) ||
          x.tags.find(y => y.toLowerCase().includes(searchStr)) !== undefined
      )
      .sort((x: Object, y: Object) => (x.title < y.title ? -1 : 1));
    return (
      <div>
        <Modal
          remove={() => removeFromLibrary(this.state.idRemove)}
          setDelete={d => this.setState({deleteOpen: d})}
          setIdRemove={i => this.setState({idRemove: i})}        />
        <div
          className="list-group"
          style={{
            height: '93%',
            width: '100%',
            overflowY: 'scroll',
            transform: 'translateY(10px)'
          }}
        >
          {filteredList.length === 0 ? (
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
            filteredList.map((x: Object) => (
              <LibraryListComponent
                onSelect={() => select(x)}
                activity={x}
                key={x._id}
                onPreview={() =>
                  store.ui.setShowPreview({
                    activityTypeId: x.activityType,
                    config: x.configuration
                  })
                }
                searchS={searchStr}
                eventKey={x._id}
                setDelete={d => this.setState({deleteOpen: d})}
                setIdRemove={i => this.setState({idRemove: i})}
              />
            ))
          )}
        </div>
      </div>
    );
  }
}

export default Library
