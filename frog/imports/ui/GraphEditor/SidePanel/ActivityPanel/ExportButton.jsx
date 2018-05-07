import * as React from 'react';
import { withState } from 'recompose';
import Modal from '../../RemoteControllers/ModalExport';
import { IconButton } from './EditActivity';

const StatelessExportButton = (props: Object) => (
  <div>
    <Modal exportType="activity" {...props} />
    <IconButton
      tooltip="Send activity to activity library"
      icon="glyphicon glyphicon-share"
      onClick={() => props.setModal(true)}
    />
  </div>
);

export default withState('modalOpen', 'setModal', false)(StatelessExportButton);
