import * as React from 'react';
import { storiesOf } from '@storybook/react';
import ErrorPage from '.';

storiesOf('Error Page', module).add('Graph', () => (
  <PageNotFound title="404 Graph" message="This graph does not exist" />
));

storiesOf('Error Page', module).add('Session', () => (
  <PageNotFound title="404 Slug" message="This session does not exist" />
));

storiesOf('Error Page', module).add('Default', () => (
  <PageNotFound title="404 Default" message="This page does not exist" />
));
