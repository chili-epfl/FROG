// @flow

import { type ActivityPackageT } from 'frog-utils';
import ActivityRunner from './ActivityRunner';

const meta = {
  name: 'Images viewer',
  type: 'react-component',
  shortDesc: 'Display images',
  description: 'Display a list of images possibly categorised',
  exampleData: [
    { title: 'Case with no data', config: { title: 'No data' }, data: {} },
    {
      title: 'Case data',
      config: {
        minVote: 1,
        images: [
          {
            url:
              'https://tuswallpapersgratis.com/wp-content/plugins/download-wallpaper-resized/wallpaper.php?x=1600&y=900&file=https://tuswallpapersgratis.com/wp-content/uploads/2013/02/Playa_Paradisiaca_1280x800-46768.jpeg',
            categories: ['landscape', 'sea']
          },
          {
            url: 'https://www.w3schools.com/css/img_lights.jpg',
            categories: ['landscape', 'sky']
          },
          {
            url: 'https://www.w3schools.com/css/img_fjords.jpg',
            categories: []
          },
          {
            url:
              'https://s3-us-west-1.amazonaws.com/powr/defaults/image-slider2.jpg',
            categories: ['landscape', 'animal']
          },
          {
            url:
              'https://beebom-redkapmedia.netdna-ssl.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg',
            categories: ['animal']
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
      dataFn.objInsert({ url: x.url, categories: x.categories, votes: {} }, i)
    );

  if (object.data === null || Array.isArray(object.data)) return;
  const dataImgs = Object.keys(object.data).filter(
    x => object.data[x].url !== undefined
  );
  if (object.data !== {})
    dataImgs.forEach((x, i) =>
      dataFn.objInsert(
        {
          url: object.data[x].url,
          categories: object.data[x].categories || [object.data[x].category],
          votes: {}
        },
        object.config.images ? object.config.images.length + i : i
      )
    );
};

export default ({
  id: 'ac-imgView',
  type: 'react-component',
  meta,
  config,
  configUI,
  dataStructure,
  mergeFunction,
  ActivityRunner
}: ActivityPackageT);
