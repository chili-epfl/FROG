import * as React from 'react';
import { storiesOf } from '@storybook/react';
import MainContent from './MainContent';

storiesOf('MainContentLandingPage', module).add('MainContent', () => (
  <MainContent
    itemList={['Tweets 1', 'Tweets 2', 'Tweets 3']}
    title="Sessions view"
    action="Add new session"
  />
));
