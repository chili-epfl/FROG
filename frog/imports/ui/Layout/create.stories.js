// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateLayout } from './CreateLayout';
import { TopBar } from '../TopBar';
import { Breadcrumb } from '../Breadcrumb';
import {
  AddCircle,
  Clear,
  ArrowBack,
  Info,
  ExpandMore,
  Search,
  Details
} from '@material-ui/icons';
import { Button } from '../Button';
import { Typography } from '@material-ui/core';
import { ItemGrid } from '../ItemGrid';
import { Item } from '../Item';

storiesOf('Layout/CreateLayout', module).add('simple', () => (
  <CreateLayout
    header={
      <TopBar
        variant="minimal"
        actions={<Button variant="minimal" icon={<Clear fontSize="small" />} />}
      />
    }
    content={
      <div style={{ margin: '64px 32px 32px 32px' }}>
        <Typography variant="h2" style={{ marginBottom: '32px' }}>
          Select template
        </Typography>
        <TopBar
          actions={
            <>
              <Button variant="minimal" icon={<Search fontSize="small" />}>
                Search
              </Button>
            </>
          }
        />
        <ItemGrid
          items={[
            'Rich Text',
            'Brainstorm',
            'Quiz',
            'Chat',
            'Video player',
            'Presentation',
            'Common Knowledge Board',
            'Words selection'
          ]}
          mapItem={item => (
            <Item
              rightIcon={<Button variant="minimal" icon={<ExpandMore />} />}
            >
              {item}
            </Item>
          )}
        />
      </div>
    }
  />
));
