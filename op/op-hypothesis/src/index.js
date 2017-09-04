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

export const meta = {
  name: 'Get ideas from Hypothesis',
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
    }
  }
};
const safeFirst = ary => (ary.length > 0 ? ary[0] : '');
const validateConfig = [
  formData =>
    formData.tag || formData.url ? null : { err: 'You need either tag or URL' }
];

const getText = ary =>
  ary ? safeFirst(compact(ary.map(y => y.exact))).replace('\t', '') : '';

const mapQuery = query => {
  const res = query.rows
    .map(x => ({
      id: uuid(),
      content: x.text,
      title: getText(x.target && x.target.length > 0 && x.target[0].selector)
    }))
    .filter(x => x.title);
  return wrapUnitAll(res);
};

// Obviously assumes even array
export const operator = (configData: {
  tag?: string,
  url?: string
}): activityDataT => {
  const query = queryString.stringify({
    tag: configData.tag,
    source: configData.url
  });
  const url = 'https://hypothes.is/api/search?' + query;
  return fetch(url).then(e => e.json()).then(mapQuery);
};

export default ({
  id: 'op-hypothesis',
  type: 'product',
  operator,
  config,
  validateConfig,
  meta
}: productOperatorT);
