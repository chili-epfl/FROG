// @flow
import React, { Component } from 'react';

import { addActivity } from '/imports/api/activities';
import LibraryListComponent from '../LibraryListComponent';
import Modal from '../ModalDelete';

type StateT = {
  activityList: Array<any>,
  deleteOpen: boolean,
  idRemove: string
};

const myFilter = (list: Array<any>, searchStr: string) =>
  list
    .filter(
      x =>
        x.activity_type.toLowerCase().includes(searchStr) ||
        x.title.toLowerCase().includes(searchStr) ||
        x.description.toLowerCase().includes(searchStr) ||
        x.tags.find(y => y.toLowerCase().includes(searchStr)) !== undefined
    )
    .sort((x: Object, y: Object) => (x.title < y.title ? -1 : 1));

class Library extends Component<Object, StateT> {
  constructor(props: Object) {
    super(props);
    this.state = {
      activityList: [],
      deleteOpen: false,
      idRemove: ''
    };
  }

  componentWillMount() {
    fetch('http://icchilisrv4.epfl.ch:5000/activities')
      .then(e => e.json())
      .then(e =>
        e.forEach(x =>
          this.setState({ activityList: [...this.state.activityList, x] })
        )
      );
  }

  render() {
    const { activityId, searchStr, store } = this.props;

    const select = (activity: Object) => {
      addActivity(
        activity.activity_type,
        activity.config,
        activityId,
        activity.parent_id,
        activity.uuid
      );
      store.addHistory();
    }; // don't track changes on the list
    return (
      <div>
        <Modal
          deleteOpen={this.state.deleteOpen}
          remove={() =>
            fetch(
              'http://icchilisrv4.epfl.ch:5000/activities?uuid=eq.'.concat(
                this.state.idRemove.toString()
              ),
              { method: 'DELETE' }
            ).then(
              this.setState({
                activityList: this.state.activityList.filter(
                  x => x.uuid !== this.state.idRemove
                )
              })
            )
          }
          setDelete={d => this.setState({ deleteOpen: d })}
          setIdRemove={i => this.setState({ idRemove: i })}
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
          {myFilter(this.state.activityList, searchStr).length === 0 ? (
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
            myFilter(this.state.activityList, searchStr).map((x: Object) => (
              <LibraryListComponent
                onSelect={() => select(x)}
                activity={x}
                key={x.uuid}
                onPreview={() =>
                  store.ui.setShowPreview({
                    activityTypeId: x.activity_type,
                    config: x.config
                  })
                }
                searchS={searchStr}
                eventKey={x.uuid}
                setDelete={d => this.setState({ deleteOpen: d })}
                setIdRemove={i => this.setState({ idRemove: i })}
              />
            ))
          )}
        </div>
      </div>
    );
  }
}

export default Library;
