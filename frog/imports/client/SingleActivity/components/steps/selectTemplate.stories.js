// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { PlayArrow } from '@material-ui/icons';

import { SelectTemplate } from './SelectTemplate';

const exampleTemplates = [
  {
    type: 'singleActivity',
    id: 'rich_text',
    name: 'Rich Text',
    shortDesc: 'This is a short description',
    description: 'This is a description'
  },
  {
    type: 'singleActivity',
    id: 'quiz',
    name: 'Quiz',
    shortDesc: 'This is a short description',
    description: 'This is a description'
  },
  {
    type: 'singleActivity',
    id: 'ck_board',
    name: 'CK Board',
    shortDesc: 'This is a short description',
    description: 'This is a description'
  },
  {
    type: 'singleActivity',
    id: 'brainstorm',
    name: 'Brainstorm',
    shortDesc: 'This is a short description',
    description: 'This is a description'
  },
  {
    type: 'singleActivity',
    id: 'Chat',
    name: 'Chat',
    shortDesc: 'This is a short description',
    description: 'This is a description'
  }
];

storiesOf('App/SingleActivity', module).add('select template', () => (
  <SelectTemplate
    availableGraphTemplates={exampleTemplates}
    availableSingleActivityTemplates={exampleTemplates}
    onSelect={action('onSelect')}
  />
));
