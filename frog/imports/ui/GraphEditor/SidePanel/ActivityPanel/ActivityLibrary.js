// @flow
import React from 'react';

import { Activities } from '/imports/api/activities';
import { Library } from '/imports/api/library';
import LibraryListComponent from '../LibraryListComponent';

export default ({ searchStr, store }: Object) => {
  // redefine !!!!!!!!!!!!!!!!!!!!
  const select = activityType => {
    Activities.update(this.props.activity._id, {
      $set: { activityType: activityType.id }
    });
    store.addHistory();
  };
  const filteredList = Library.find()
    .fetch()
    .filter(
      x =>
        x.activityType.toLowerCase().includes(searchStr) ||
        x.title.toLowerCase().includes(searchStr) ||
        x.description.toLowerCase().includes(searchStr)
    )
    .sort((x: Object, y: Object) => (x.title < y.title ? -1 : 1));
  return (
    <div>
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
            <LibraryListComponent
              onSelect={() => select(x)}
              activity={x}
              key={x._id}
              onPreview={() =>
                // redefine
                store.ui.setShowPreview({
                  activityTypeId: x._id
                })
              }
              searchS={searchStr}
              eventKey={x._id}
            />
          ))
        )}
      </div>
    </div>
  );
};
