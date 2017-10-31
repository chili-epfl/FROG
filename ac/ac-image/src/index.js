// @flow

import { type ActivityPackageT, uuid } from 'frog-utils';
import { compact, isEmpty } from 'lodash';

import ActivityRunner from './ActivityRunner';
import dashboard from './Dashboard';

export const DEFAULT_COMMENT_VALUE = '';

const meta = {
  name: 'Image viewer',
  type: 'react-component',
  shortDesc: 'Display images',
  description: 'Display a list of images possibly categorised',
  exampleData: [
    {
      title: 'Simple view',
      config: {
        minVote: 1,
        images: [
          {
            url: 'https://wpclipart.com/space/moon/moon_2/moon_photo.jpg'
          },
          {
            url: 'https://wpclipart.com/space/meteor/bolide.png'
          },
          {
            url: 'https://wpclipart.com/space/solar_system/Earth/earth_4.png'
          },
          {
            url:
              'https://wpclipart.com/space/solar_system/sun/solar_eclipse/solar_eclipse_corona.jpg'
          },
          {
            url:
              'https://wpclipart.com/space/solar_system/sun/sun_prominence.jpg'
          }
        ]
      },
      data: {}
    },
    {
      title: 'With uploads',
      config: {
        canUpload: true,
        guidelines:
          'Ajoutez des images ou bien prenez une photo avec votre webcam'
      },
      data: {}
    },
    {
      title: 'With categories',
      config: {
        guidelines: 'Look at categories of image',
        images: [
          {
            url: 'https://wpclipart.com/space/moon/moon_2/moon_photo.jpg',
            categories: ['moon', 'solar system']
          },
          {
            url: 'https://wpclipart.com/space/meteor/bolide.png',
            categories: ['meteor']
          },
          {
            url: 'https://wpclipart.com/space/solar_system/Earth/earth_4.png',
            categories: ['earth', 'solar system']
          },
          {
            url:
              'https://wpclipart.com/space/solar_system/sun/solar_eclipse/solar_eclipse_corona.jpg',
            categories: ['sun', 'moon', 'solar system']
          },
          {
            url:
              'https://wpclipart.com/space/solar_system/sun/sun_prominence.jpg',
            categories: ['sun', 'solar system']
          }
        ]
      },
      data: {}
    },
    {
      title: 'With votes',
      config: {
        guidelines: 'Votez pour les images les plus interessantes',
        canVote: true,
        minVote: 2,
        images: [
          {
            url: 'https://wpclipart.com/space/moon/moon_2/moon_photo.jpg'
          },
          {
            url: 'https://wpclipart.com/space/meteor/bolide.png'
          },
          {
            url: 'https://wpclipart.com/space/solar_system/Earth/earth_4.png'
          },
          {
            url:
              'https://wpclipart.com/space/solar_system/sun/solar_eclipse/solar_eclipse_corona.jpg'
          },
          {
            url:
              'https://wpclipart.com/space/solar_system/sun/sun_prominence.jpg'
          }
        ]
      },
      data: {}
    }
  ]
};

const config = {
  type: 'object',
  properties: {
    guidelines: {
      title: 'Guidelines',
      type: 'string'
    },
    canVote: {
      title: 'Can students vote ?',
      type: 'boolean'
    },
    minVote: {
      title: 'Number of vote minimum to select an image (default: 1)',
      type: 'number'
    },
    canUpload: {
      title: 'Can students upload new images?',
      type: 'boolean'
    },
    canComment: {
      title: 'Should students comment on images?',
      type: 'boolean'
    },
    commentGuidelines: {
      title: 'Comment guidelines',
      type: 'string'
    },
    hideCategory: {
      title: 'Hide the categories',
      type: 'boolean'
    },
    images: {
      title: 'Images',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            title: 'URL of the image'
          },
          categories: {
            type: 'array',
            title: 'Categories',
            items: {
              type: 'string'
            }
          }
        }
      }
    }
  }
};

const configUI = {
  minVote: { conditional: 'canVote' }
};

const dataStructure = {};

const mergeFunction = (object, dataFn) => {
  if (object.config.images)
    object.config.images.forEach((x, i) =>
      dataFn.objInsert({ votes: {}, comment: DEFAULT_COMMENT_VALUE, ...x }, i)
    );

  if (object.data === null || object.data === {}) return;
  const dataImgs = (Array.isArray(object.data)
    ? object.data
    : Object.keys(object.data).map(x => object.data[x])
  ).filter(x => x.url !== undefined);
  dataImgs.forEach(x =>
    dataFn.objInsert(
      {
        votes: {},
        categories: x.categories || (x.category && [x.category]),
        comment: DEFAULT_COMMENT_VALUE,
        ...x
      },
      x.key || uuid()
    )
  );
};

const exportData = (configData, { payload }) => {
  const csv = Object.keys(payload).reduce((acc, line) => {
    const data = payload[line].data;
    return [
      ...acc,
      ...compact(
        Object.values(data).map(
          item =>
            item &&
            item.key &&
            [
              line,
              item.key,
              item.instanceId,
              JSON.stringify(item.comment),
              isEmpty(item.categories) ? '' : JSON.stringify(item.categories),
              isEmpty(item.votes) ? '' : JSON.stringify(item.votes)
            ].join('\t')
        )
      )
    ];
  }, []);
  const headers = [
    'instanceId',
    'imageId',
    'fromInstanceId',
    'comment',
    'categories',
    'votes'
  ].join('\t');
  return [headers, ...csv].join('\n');
};

export default ({
  id: 'ac-image',
  type: 'react-component',
  meta,
  config,
  configUI,
  dataStructure,
  mergeFunction,
  ActivityRunner,
  dashboard,
  exportData
}: ActivityPackageT);
