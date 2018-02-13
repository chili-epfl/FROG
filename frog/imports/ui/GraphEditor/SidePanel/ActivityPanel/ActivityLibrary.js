// @flow
import React from 'react';

import { addActivity } from '/imports/api/activities';
import { ActivityLibrary } from '/imports/api/activityLibrary';
import LibraryListComponent from '../LibraryListComponent';

export default ({ activityId, searchStr, store }: Object) => {
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
