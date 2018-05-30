// @flow

import { type ActivityPackageT } from 'frog-utils';
import ActivityRunner from './Prez';
import { config } from './config';

const meta = {
  name: 'Presentation activity',
  shortDesc: 'Show PDFs',
  description: '',
  exampleData: [
    { title: 'Case with no data', config: { title: 'No data' }, data: {} }
  ]
};

const dataStructure = {
  annotations: {},
  pageNum: 1,
  pdf_file: '',
  furthestPageNum: 1
};

export default ({
  id: 'ac-prez',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  dataStructure
}: ActivityPackageT);
