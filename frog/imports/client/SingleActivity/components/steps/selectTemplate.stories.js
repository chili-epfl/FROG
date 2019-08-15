// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { PlayArrow } from '@material-ui/icons';

import { SelectTemplate } from './SelectTemplate';

const exampleTemplates = [
  { id: 'rich_text', name: 'Rich Text' },
  { id: 'quiz', name: 'Quiz' },
  { id: 'ck_board', name: 'CK Board' },
  { id: 'brainstorm', name: 'Brainstorm' },
  { id: 'Chat', name: 'Chat' }
];

storiesOf('App/SingleActivity', module).add('select template', () => (
  <SelectTemplate
    availableGraphTemplates={exampleTemplates}
    availableSingleActivityTemplates={exampleTemplates}
    onSelect={action('onSelect')}
  />
));
