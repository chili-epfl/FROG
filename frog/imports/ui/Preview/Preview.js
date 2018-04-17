// @flow

import * as React from 'react';
import ReactTooltip from 'react-tooltip';
import Modal from 'react-modal';
import ShareDB from 'sharedb';
import Draggable from 'react-draggable';

import { withStyles } from 'material-ui/styles';

import { activityTypesObj } from '../../activityTypes';
import { Logs } from './dashboardInPreviewAPI';
import ShowLogs from './ShowLogs';
import Controls from './Controls';
import Content, { initActivityDocuments } from './Content';
import ConfigPanel from './ConfigPanel';
import styles from './previewStyles';

const backend = new ShareDB();
export const connection = backend.connect();

const StatelessPreview = (props: Object) => {
  const {
    activityTypeId,
    modal,
    config,
    dismiss,
    example,
    showLogs,
    fullWindow,
    showDashExample,
    classes,
    instances
  } = props;

  const activityType = activityTypesObj[activityTypeId];
  if (!activityType) {
    return (
      <div className={classes.main}>
        <ConfigPanel {...props} />
      </div>
    );
  }

  initActivityDocuments(instances, activityType, example, config, false);

  const PreviewContent =
    showLogs && !showDashExample ? (
      <ShowLogs logs={Logs} />
    ) : (
      <Content {...props} />
    );

  const FullWindowP = (
    <div>
      <div className={classes.fullWindow}>{PreviewContent}</div>
      <Draggable onStart={() => true} defaultPosition={{ x: 200, y: 300 }}>
        <div className={classes.fullWindowControl}>
          <Controls {...props} />
        </div>
      </Draggable>
      <ReactTooltip delayShow={1000} place="right" />
    </div>
  );

  const NoModalP = (
    <div className={classes.main}>
      <ConfigPanel {...props} />
      <div className={classes.noModal}>
        <Controls {...props} />
        {PreviewContent}
        <ReactTooltip delayShow={1000} place="right" />
      </div>
    </div>
  );

  const ModalP = (
    <Modal
      ariaHideApp={false}
      contentLabel={'Preview of ' + activityTypeId}
      isOpen
      onRequestClose={dismiss}
    >
      <Controls {...props} />
      {PreviewContent}
      <ReactTooltip delayShow={1000} place="right" />
    </Modal>
  );

  return fullWindow ? FullWindowP : modal ? ModalP : NoModalP;
};

const StyledPreview = withStyles(styles)(StatelessPreview);

export default StyledPreview;
