// @flow
import queryString from 'query-string';
import { compact } from 'lodash';
import fetch from 'isomorphic-fetch';
import {
  uuid,
  wrapUnitAll,
  type activityDataT,
  type productOperatorRunnerT
} from 'frog-utils';

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

const operator = (configData: {
  tag?: string,
  url?: string,
  search?: string,
  limit?: number
}): activityDataT => {
  const query = queryString.stringify({
    tag: configData.tag,
    source: configData.url,
    any: configData.search
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

export default (operator: productOperatorRunnerT);
