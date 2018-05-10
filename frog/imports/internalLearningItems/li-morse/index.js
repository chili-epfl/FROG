import * as React from 'react';
import TextInput from './TextInput';

export default {
  viewThumb: props => <TextInput {...props} />,
  editable: true,
  zoomable: false,
  edit: props => <TextInput edit {...props} />,
  name: 'Morse code',
  id: 'li-morse',
  dataStructure: { string: [] }
};
