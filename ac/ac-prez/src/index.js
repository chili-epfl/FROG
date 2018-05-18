// @flow

import { type ActivityPackageT } from 'frog-utils';
import ActivityRunner from './Prez';

const meta = {
  name: 'Presentation activity',
  shortDesc: 'Show PDFs',
  description: '',
  exampleData: [
    { title: 'Case with no data', config: { title: 'No data' }, data: {} }
  ]
};

const config = {
  type: 'object',
  properties: {
    title: {
      title: 'What is the title?',
      type: 'string'
    },
    pdf_url: {
      title: 'Full PDF URL',
      type: 'string'
    },
    debug: {
      debug: true,
      type: 'boolean'
    }
  }
};

const dataStructure = {
  annotations: [],
  pageNum: 1,
  pdf_file: ''
};

export default ({
  id: 'ac-prez',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  dataStructure
}: ActivityPackageT);
