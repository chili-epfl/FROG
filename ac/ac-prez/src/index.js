// @flow

import { type ActivityPackageT } from 'frog-utils';
import { config } from './config';

const meta = {
  name: 'Presentation',
  shortDesc: 'Present PDFs',
  description: '',
  exampleData: []
};

const dataStructure = {
  annotations: {},
  scratchpadAnnotations: [],
  scratchpadMode: false,
  pageNum: 1,
  pdf_file: '',
  furthestPageNum: 1
};

export default ({
  id: 'ac-prez',
  type: 'react-component',
  configVersion: 1,
  meta,
  config,
  dataStructure
}: ActivityPackageT);
