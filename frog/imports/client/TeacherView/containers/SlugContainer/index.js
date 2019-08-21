// @flow

import { Meteor } from 'meteor/meteor';
import * as React from 'react';

import { Tooltip } from '@material-ui/core';
import { OpenInNew } from '@material-ui/icons';

import { Button } from '/imports/ui/Button';

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
    <Tooltip title={session.slug}>
      <Button
        variant="primary"
        rightIcon={<OpenInNew fontSize="small" />}
        onClick={() => window.location.assign(`${learnRoot}/${session.slug}`)}
      >
        Student portal
      </Button>
    </Tooltip>
  );
};
