import * as React from 'react';
import { withState } from 'recompose';

import { LibraryStates } from '/imports/api/cache';
import { loadActivityMetaData } from '/imports/api/remoteActivities';

import Modal from '../../RemoteControllers/ModalExport';
import { IconButton } from '../index';

const StatelessExportButton = (props: Object) => (
  <div>
    <Modal
      exportType="activity"
      {...props}
      metadatas={
        props.metadatas ||
        LibraryStates.activityList.find(x => x.uuid === props.activity.parentId)
      }
    />
    <IconButton
      tooltip="Send activity to activity library"
      icon="glyphicon glyphicon-share"
      onClick={() =>
        props.activity.parentId
          ? loadActivityMetaData(props.activity.parentId, () =>
              props.setModal(true)
            )
          : props.setModal(true)
      }
    />
  </div>
);

export default withState('modalOpen', 'setModal', false)(StatelessExportButton);
