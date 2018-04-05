// @flow
import React, { Component } from 'react';

import LibraryListComponent from './SidePanel/LibraryListComponent';

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
    fetch('http://icchilisrv4.epfl.ch:5000/graphs')
      .then(e => e.json())
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
      <div>
        {/* <Modal
          deleteOpen={this.state.deleteOpen}
          remove={() =>
            fetch(
              'http://icchilisrv4.epfl.ch:5000/activities?uuid=eq.'.concat(
                this.state.idRemove.toString()
              ),
              { method: 'DELETE' }
            ).then(
              this.setState({
                graphList: this.state.graphList.filter(
                  x => x.uuid !== this.state.idRemove
                )
              })
            )
          }
          setDelete={d => this.setState({ deleteOpen: d })}
          setIdRemove={i => this.setState({ idRemove: i })}
        /> */}
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
                onSelect={() => null}
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
      </div>
    );
  }
}

export default GraphLibrary;
