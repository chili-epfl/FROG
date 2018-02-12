// @flow
import React from 'react';

import { Activities } from '/imports/api/activities';
import { Library } from '/imports/api/library';
import ListComponent from '../ListComponent';

export default ({searchStr}: Object) => {

  // redefine
  const select = activityType => {
    Activities.update(this.props.activity._id, {
      $set: { activityType: activityType.id }
    });
    this.props.store.addHistory();
  };

  // redefine
  const filteredList = Library.find()
    .filter(
      x =>
        x.activityType.toLowerCase().includes(searchStr) ||
        x.title.toLowerCase().includes(searchStr) ||
        x.description.toLowerCase().includes(searchStr)
    )
    .sort((x: Object, y: Object) => (x.title < y.title ? -1 : 1));
 return (<div>
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
        filteredList.map((x: ActivityPackageT) => (
          <ListComponent // redefine
            hasPreview={x.meta.exampleData !== undefined}
            onSelect={() => select(x)}
            showExpanded={this.state.expanded === x._id}
            expand={() => this.setState({ expanded: x._id })}
            key={x._id}
            onPreview={() =>
              this.props.store.ui.setShowPreview({
                activityTypeId: x._id
              })
            }
            object={x}
            searchS={this.state.searchStr}
            eventKey={x._id}
          />
        ))
      )}
    </div>
    Library
  </div>
)};
