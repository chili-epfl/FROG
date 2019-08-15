// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { PlayArrow } from '@material-ui/icons';

import { ConfigureTemplate } from './ConfigureTemplate';

const exampleConfiguration = {
  name: 'Rich Text',
  description: 'This activity is a rich text component',
  longDescription: 'This is a very long description. Like very very long.'
};

storiesOf('App/SingleActivity', module).add('configure template', () => (
  <ConfigureTemplate {...exampleConfiguration}>
    <div>Configuration Form goes here</div>
  </ConfigureTemplate>
));
