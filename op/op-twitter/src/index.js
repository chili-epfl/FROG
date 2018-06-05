// @flow
import queryString from 'query-string';
import { compact } from 'lodash';
import fetch from 'isomorphic-fetch';
import {
  uuid,
  wrapUnitAll,
  type productOperatorT,
  type activityDataT
} from 'frog-utils';
import liType from './liType';

export const meta = {
  name: 'Get ideas from Hypothesis',
  shortName: 'Hypothesis',
  shortDesc: 'Get ideas from Hypothesis API',
  description: 'Collect ideas from an Hypothesis API by hashtag or document id.'
};

export const config = {
  type: 'object',
  properties: {
    tag: {
      type: 'string',
      title: 'Hashtag'
    },
    url: {
      type: 'string',
      title: 'URL'
    },
    limit: { type: 'number', title: 'Max number of items to fetch' }
  }
};
const validateConfig = [
  formData =>
    formData.tag || formData.url ? null : { err: 'You need either tag or URL' }
];

const safeFirst = ary => (ary.length > 0 ? ary[0] : '');

const getText = ary =>
  ary ? safeFirst(compact(ary.map(y => y.exact))).replace(/\t/gi, '') : '';

const cleanText = x => (x || '').replace(/\t/gi, '');

const mapQuery = query => {
  const res = query.rows.map(x => ({
    id: uuid(),
    liDocument: {
      liType: 'li-hypothesis',
      createdAt: new Date(),
      createdBy: 'op-hypothesis',
      payload: {
        content: cleanText(x.text),
        title: getText(x?.target?.[0]?.selector),
        doc: cleanText(x?.document?.title?.[0])
      }
    }
  }));
  return wrapUnitAll(
    res.reduce((acc, x) => {
      const id = uuid();
      return { ...acc, [id]: { id, li: x } };
    }, {})
  );
};

// Obviously assumes even array
export const operator = (configData: {
  tag?: string,
  url?: string,
  limit?: number
}): activityDataT => {
  const query = queryString.stringify({
    tag: configData.tag,
    source: configData.url
  });
  const url =
    'https://hypothes.is/api/search?' +
    query +
    '&limit=' +
    (configData.limit || 20);
  return fetch(url)
    .then(e => e.json())
    .then(mapQuery);
};

export default ({
  id: 'op-hypothesis',
  type: 'product',
  operator,
  config,
  validateConfig,
  meta,
  LearningItems: [liType]
}: productOperatorT);
