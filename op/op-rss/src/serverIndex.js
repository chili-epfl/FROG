// @flow
import {
  uuid,
  wrapUnitAll,
  type productOperatorT,
  type activityDataT,
  flattenOne
} from 'frog-utils';
import feedread from 'davefeedread';
import liType from './liType';
import { isEmpty } from 'lodash';
import pkg from './index';

export const operator = (configData: {
  urls?: string[],
  limit?: number
}): activityDataT => {
  if (!isEmpty(configData.urls)) {
    return Promise.all(
      configData.urls.map(
        url =>
          new Promise((resolve, reject) => {
            feedread.parseUrl(url, 60, (err, feed) => {
              if (err) {
                reject(err);
              } else {
                resolve(
                  feed.items.map(x => ({
                    id: uuid(),
                    liDocument: {
                      liType: 'li-rss',
                      createdAt: new Date(),
                      createdBy: 'op-rss',
                      payload: {
                        content: x.description,
                        title: x.title,
                        date: x.date || x.pubdate || x.pubDate,
                        link: x.link,
                        categories: x.categories,
                        blogtitle: x.meta?.title,
                        author: x.author
                      }
                    }
                  }))
                );
              }
            });
          })
      )
    ).then(res =>
      wrapUnitAll(
        flattenOne(res).reduce((acc, x) => {
          const id = uuid();
          return { ...acc, [id]: { id, li: x } };
        }, {})
      )
    );
  } else {
    return wrapUnitAll({});
  }
};

export default ({
  ...pkg,
  operator
}: productOperatorT);
