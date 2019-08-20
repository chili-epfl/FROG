import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Header } from '.';

storiesOf('Frog Landing Page/Header', module).add('Simple', () => (
  <Header
    openSignin={() => {
      console.log('Sign In');
    }}
  />
));
