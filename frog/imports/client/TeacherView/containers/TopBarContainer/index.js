// @flow
import * as React from 'react';

import {
  OpenInNew,
  MoreVert,
  Settings,
  Restore,
  Clear,
  SaveAlt,
  CloudDownload,
  Cast
} from '@material-ui/icons';

import { Breadcrumb } from '/imports/ui/Breadcrumb';
import { TopBar } from '/imports/ui/TopBar';
import { Button } from '/imports/ui/Button';
import { OverflowMenu } from '/imports/ui/OverflowMenu';
import { RowDivider, RowButton } from '/imports/ui/RowItems';

import { OrchestrationContext } from '../../context';

export const TopBarContainer = () => {
  const session = React.useContext(OrchestrationContext);

  return (
    <TopBar
      navigation={<Breadcrumb paths={[session.slug]} />}
      actions={
        <OverflowMenu
          button={
            <Button variant="minimal" icon={<MoreVert fontSize="small" />} />
          }
        >
          <RowButton icon={<Settings fontSize="small" />}>
            Session Settings
          </RowButton>
          <RowDivider />
          <RowButton
            icon={<Restore fontSize="small" />}
            onClick={session.restart}
          >
            Restart session
          </RowButton>
          <RowButton
            icon={<Clear fontSize="small" />}
            onClick={session.removeAllUsers}
          >
            Remove all students
          </RowButton>
          <RowDivider />
          <RowButton
            icon={<OpenInNew fontSize="small" />}
            onClick={session.open1Student}
          >
            Open 1 student
          </RowButton>
          <RowButton
            icon={<OpenInNew fontSize="small" />}
            onClick={session.open4Students}
          >
            Open 4 students
          </RowButton>
          <RowDivider />
          <RowButton icon={<SaveAlt fontSize="small" />}>
            Export session
          </RowButton>
          <RowButton
            icon={<SaveAlt fontSize="small" />}
            onClick={session.exportWiki}
          >
            Export all activities to wiki
          </RowButton>
          <RowButton
            icon={<CloudDownload fontSize="small" />}
            onClick={session.downloadLog}
          >
            Download log CSV
          </RowButton>
          <RowDivider />
          <RowButton
            icon={<Cast fontSize="small" />}
            onClick={session.openProjector}
          >
            Open projector view
          </RowButton>
        </OverflowMenu>
      }
    />
  );
};
