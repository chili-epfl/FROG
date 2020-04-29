import * as React from 'react';
import { storiesOf } from '@storybook/react';
import LearnLandingPage from '.';

const onSlugEnter = slug => {
  console.info(slug);
};

storiesOf('Learn Landing Page', module).add('Simple', () => (
  <LearnLandingPage onSlugEnter={onSlugEnter} />
));

storiesOf('Learn Landing Page', module).add('With Error', () => (
  <LearnLandingPage
    errorMessage="This session does not exist"
    onSlugEnter={onSlugEnter}
  />
));
