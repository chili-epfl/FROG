// @flow
/* eslint-disable camelcase */
import queryString from 'query-string';
import { flatten } from 'lodash';
import fetch from 'isomorphic-fetch';
import {
  uuid,
  shorten,
  wrapUnitAll,
  type activityDataT,
  type productOperatorRunnerT
} from 'frog-utils';

const parseAnnotation = a => {
  const res = {
    username: a.user_info?.display_name || a.user.split(/[:@]/)?.[1],
    text: a.text,
    date: a.updated && new Date(a.updated).toDateString(),
    quotation:
      a.target?.[0]?.selector && a.target[0].selector.find(x => x.exact)?.exact,
    article: !a.references && shorten(a.document?.title?.[0], 50),
    articleSite:
      a.target?.[0]?.source &&
      a.target[0].source.split('/')?.length > 2 &&
      a.target[0].source.split('/')[2],
    lastRef: a.references && a.references.pop(),
    id: a.id,
    updated: a.updated
  };

  return res;
};

const mapQuery = query => {
  const res = query
    .filter(x => !x.references || x.references.length === 0)
    .map(x => ({
      id: uuid(),
      liDocument: {
        liType: 'li-hypothesis',
        createdAt: new Date(),
        createdBy: 'op-hypothesis',
        payload: {
          rows: [x, ...query.filter(y => y.references?.[0] === x.id)].map(
            item => parseAnnotation(item)
          )
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
  limit?: number,
  group?: string,
  token?: string
}): activityDataT => {
  const query = queryString.stringify({
    tag: configData.tag,
    source: configData.url,
    any: configData.search,
    group: configData.group
  });
  const url = 'https://hypothes.is/api/search?' + query + '&limit=0';
  return fetch(
    url,
    configData.token && {
      headers: {
        Authorization: 'Bearer ' + configData.token
      }
    }
  )
    .then(e => e.json())
    .then(e => {
      const limit = parseInt(configData.limit, 10) || 9999;
      const numFetches = Math.ceil(Math.min(limit, e.total) / 200);
      const fetches = new Array(numFetches).fill().map((_, i) =>
        fetch(
          `https://hypothes.is/api/search?${query}&limit=200&offset=${i * 200}`,
          configData.token && {
            headers: {
              Authorization: 'Bearer ' + configData.token
            }
          }
        ).then(x => x.json())
      );
      return Promise.all(fetches);
    })
    .then(z => mapQuery(flatten(z.map(a => a.rows))));
};

export default (operator: productOperatorRunnerT);
