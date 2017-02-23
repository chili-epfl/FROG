// @flow

import { type ObjectT } from 'frog-utils';

export const meta = {
  name: 'Aggregate CK Board',
  type: 'product'
};

export const config = {
  title: 'Configuration for Aggregate CK Board',
  type: 'object',
  properties: {
    anonymize: {
      type: 'boolean',
      title: 'Anonymize contributions?'
    },
    title_path: {
      type: 'string',
      title: 'JSONPath to title'
    },
    content_path: {
      type: 'string',
      title: 'JSONPath to contents'
    }
  }
};

// Obviously assumes even array
export const operator = (configData: Object, object: ObjectT) => {
  const { products } = object;
  return {
    socialStructure: {},
    product: products[0]
  };
};

/*
  const rnd = () => Math.floor(Math.random() * 300);

  const ret = unrollProducts(products).map(x => {
    const title = JSONPath({ path: config.title_path, json: x.data })[0];
    const content = JSONPath({ path: config.content_path, json: x.data })[0];
    const fullContent = booleanize(config.anonymize)
      ? content
      : content + ' (' + x.username + ')';
    return {
      userId: x.userId,
      title,
      content: fullContent,
      x: rnd(),
      y: rnd()
    };
  });

  return ret;
  */

export default {
  id: 'op-aggregate-ck-board',
  operator,
  config,
  meta
};
