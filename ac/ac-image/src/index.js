// @flow

import { type ActivityPackageT, uuid } from 'frog-utils';

import ActivityRunner from './ActivityRunner';
import dashboard from './Dashboard';

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
    { title: 'With uploads', config: { canUpload: true }, data: {} },
    {
      title: 'With categories',
      config: {
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
    canVote: {
      title: 'Can students vote ?',
      type: 'boolean'
    },
    minVote: {
      title: 'Number of vote minimum to select an image (default: 1)',
      type: 'number'
    },
    canUpload: {
      title: 'Can students upload new images ?',
      type: 'boolean'
    },
    filterTrash: {
      title: 'Should trash images be removed?',
      type: 'boolean'
    },
    individual: { title: 'Students work individually', type: 'boolean' },
    grouping: { title: 'Group students by groupingKey', type: 'boolean' },
    groupingKey: { title: 'Grouping key', type: 'socialAttribute' },
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
  minVote: { conditional: 'canVote' },
  individual: { conditional: formdata => !formdata.grouping },
  grouping: { conditional: formdata => !formdata.individual },
  groupingKey: { conditional: 'grouping' }
};

const dataStructure = {};

const mergeFunction = (object, dataFn) => {
  if (object.config.images)
    object.config.images.forEach((x, i) =>
      dataFn.objInsert({ url: x.url, categories: x.categories, votes: {} }, i)
    );

  if (object.data === null || object.data === {}) return;
  const dataImgs = (Array.isArray(object.data)
    ? object.data
    : Object.keys(object.data).map(x => object.data[x])
  ).filter(x => x.url !== undefined);
  dataImgs
    .filter(
      x => !object.config.filterTrash || (x.category && x.category !== 'trash')
    )
    .forEach(x =>
      dataFn.objInsert(
        {
          votes: {},
          ...x,
          categories: x.categories || (x.category && [x.category])
        },
        x.key || uuid()
      )
    );
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
  dashboard
}: ActivityPackageT);
