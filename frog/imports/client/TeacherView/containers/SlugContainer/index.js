// @flow

import { Meteor } from 'meteor/meteor';
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

import { Button } from '/imports/ui/Button';
import { OverflowMenu } from '/imports/ui/OverflowMenu';
import { RowDivider, RowButton } from '/imports/ui/RowItems';

import { OrchestrationContext } from '../../context';

export const SlugContainer = () => {
  const session = React.useContext(OrchestrationContext);

  let root = Meteor.absoluteUrl();
  if (root.slice(-1) === '/') {
    root = root.slice(0, -1);
  }
  let learnRoot;
  if (root === 'http://localhost:3000') {
    learnRoot = 'http://learn.chilifrog-local.com:3000';
  } else {
    learnRoot = 'https://learn.chilifrog.ch';
  }

  return (
    <>
      <Button
        variant="primary"
        rightIcon={<OpenInNew fontSize="small" />}
        onClick={() => window.location.assign(`${learnRoot}/${session.slug}`)}
      >
        <>Student portal</>
      </Button>
      <OverflowMenu
        button={
          <Button variant="minimal" icon={<MoreVert fontSize="small" />} />
        }
      >
        <RowButton icon={<Settings fontSize="small" />}>
          Session Settings
        </RowButton>
        <RowDivider />
        <RowButton icon={<Restore fontSize="small" />}>
          Restart session
        </RowButton>
        <RowButton icon={<Clear fontSize="small" />}>
          Remove all students
        </RowButton>
        <RowDivider />
        <RowButton icon={<OpenInNew fontSize="small" />}>
          Open 1 student window
        </RowButton>
        <RowButton icon={<OpenInNew fontSize="small" />}>
          Open 4 student windows
        </RowButton>
        <RowDivider />
        <RowButton icon={<SaveAlt fontSize="small" />}>
          Export session
        </RowButton>
        <RowButton icon={<SaveAlt fontSize="small" />}>
          Export all activities to wiki
        </RowButton>
        <RowButton icon={<CloudDownload fontSize="small" />}>
          Download log CSV
        </RowButton>
        <RowDivider />
        <RowButton icon={<Cast fontSize="small" />}>
          Open projector view
        </RowButton>
      </OverflowMenu>
    </>
  );
};
