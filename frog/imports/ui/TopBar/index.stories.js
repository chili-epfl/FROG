// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Edit, PlayCircleFilled, PlayArrow, Details } from '@material-ui/icons';
import { TopBar } from '.';

const SimpleWrapper = () => {
  const [currentTab, setCurrentTab] = React.useState(0);
  return (
    <TopBar
      icon={<Details />}
      paths={['Recent']}
      primaryActions={[
        {
          id: 'start',
          title: 'Start session',
          icon: <PlayArrow />,
          callback: action('action_callback')
        },
        {
          id: 'projector',
          title: 'Open projector view',
          callback: action('action_callback')
        }
      ]}
      secondaryActions={[
        {
          id: 'start',
          title: 'Start session',
          icon: <PlayArrow />,
          callback: action('action_callback')
        },
        {
          id: 'projector',
          title: 'Open projector view',
          callback: action('action_callback')
        }
      ]}
      onViewChange={i => {
        setCurrentTab(i);
        action('tab_change')(i);
      }}
    />
  );
};

storiesOf('TopBar', module).add('simple', () => <SimpleWrapper />);
