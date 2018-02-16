// @flow
import React from 'react';
import { compose, withState } from 'recompose';

import { addActivity } from '/imports/api/activities';
import {
  ActivityLibrary,
  removeFromLibrary
} from '/imports/api/activityLibrary';
import LibraryListComponent from '../LibraryListComponent';
import Modal from '../ModalDelete';

const Library = ({
  activityId,
  searchStr,
  store,
  deleteOpen,
  setDelete,
  idRemove,
  setIdRemove
}: Object) => {
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
        remove={() => removeFromLibrary(idRemove)}
        {...{ deleteOpen, setDelete }}
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
              {...{ setDelete, setIdRemove }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default compose(
  withState('deleteOpen', 'setDelete', false),
  withState('idRemove', 'setIdRemove', '')
)(Library);
