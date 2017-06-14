import queryString from 'query-string';
import { compact } from 'lodash';
import fetch from 'isomorphic-fetch';

export const meta = {
  name: 'Get ideas from Hypothesis',
  type: 'product'
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
const safeFirst = ary => ary.length > 0 && ary[0];
const getText = ary =>
  ary && safeFirst(compact(ary.map(y => y.exact))).replace('\t', '');

const mapQuery = query =>
  query.rows
    .map(x => ({
      content: x.text,
      title: getText(x.target && x.target.length > 0 && x.target[0].selector)
    }))
    .filter(x => x.title);

// Obviously assumes even array
export const operator = (configData, object) => {
  const query = queryString.stringify({
    tag: configData.tag,
    source: configData.url
  });
  const url = 'https://hypothes.is/api/search?' + query;
  return fetch(url).then(e => e.json()).then(mapQuery);
};

export default {
  id: 'op-hypothesis',
  operator,
  config,
  meta
};
