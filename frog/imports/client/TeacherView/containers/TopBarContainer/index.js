// @flow
import * as React from 'react';
import { withRouter } from 'react-router-dom';

import {
  OpenInNew,
  MoreVert,
  Settings,
  Restore,
  Clear,
  SaveAlt,
  CloudDownload,
  Cast,
  ArrowBack
} from '@material-ui/icons';

import { Breadcrumb } from '/imports/ui/Breadcrumb';
import { TopBarAccountsWrapper } from '/imports/containers/TopBarWrapper';
import { Button } from '/imports/ui/Button';
import { OverflowMenu } from '/imports/ui/OverflowMenu';
import { RowDivider, RowButton } from '/imports/ui/RowItems';
import { useModal } from '/imports/ui/Modal';

import { OrchestrationContext } from '../../context';
import { SettingsModal } from './SettingsModal';

export const TopBarContainer = withRouter(({ history }) => {
  const [showModal] = useModal();
  const session = React.useContext(OrchestrationContext);

  const showSettingsModal = () => {
    showModal(
      <SettingsModal
        currentSettings={session.settings}
        onChange={settings => session.updateSettings(settings)}
      />
    );
  };

  return (
    <TopBarAccountsWrapper
      navigation={
        <>
          <Button
            variant="minimal"
            icon={<ArrowBack fontSize="small" />}
            onClick={() => history.push('/')}
          />
          <Breadcrumb paths={[session.slug]} />
        </>
      }
      actions={
        // $FlowFixMe
        <OverflowMenu
          button={
            <Button variant="minimal" icon={<MoreVert fontSize="small" />} />
          }
        >
          <RowButton
            icon={<Settings fontSize="small" />}
            onClick={showSettingsModal}
          >
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
          <RowButton
            icon={<SaveAlt fontSize="small" />}
            onClick={session.exportSession}
          >
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
});
