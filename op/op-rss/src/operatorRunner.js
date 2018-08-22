// @flow
import {
  uuid,
  wrapUnitAll,
  type productOperatorRunnerT,
  flattenOne,
  type activityDataT
} from 'frog-utils';
import { isEmpty } from 'lodash';
import feedread from '@houshuang/davefeedread';

const operator = (configData: {
  urls: string[],
  limit?: number
}): activityDataT | Promise<activityDataT> => {
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
                        author: x.author,
                        enclosure: x.enclosures?.[0]?.url
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

export default (operator: productOperatorRunnerT);
