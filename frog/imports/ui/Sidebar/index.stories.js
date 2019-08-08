// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import {
  Details,
  Edit,
  PlayArrow,
  ExpandMore,
  People,
  Add,
  SubdirectoryArrowRight,
  ArrowDownward,
  ArrowRight
} from '@material-ui/icons';
import { Sidebar } from '.';

import { Logo } from '../Logo';
import { RowButton } from '../Button/RowButton';
import { Panel } from './Panel';

storiesOf('Sidebar', module).add('simple', () => (
  <Sidebar
    header={<Logo />}
    footer={
      <RowButton icon={<Add />} text="Create a new session" size="large" />
    }
  >
    <Panel>
      <RowButton
        icon={<Details fontSize="small" />}
        text="Recent"
        variant="primary"
      />
      <RowButton icon={<Edit fontSize="small" />} text="My Drafts" />
      <RowButton
        icon={<PlayArrow fontSize="small" />}
        text="My Sessions"
        active
      />
    </Panel>
    <Panel title="Classes">
      <RowButton icon={<ArrowRight fontSize="small" />} text="2019" />
      <RowButton icon={<ArrowRight fontSize="small" />} text="2018" />
      <RowButton icon={<ArrowRight fontSize="small" />} text="2017" />
    </Panel>
  </Sidebar>
));
