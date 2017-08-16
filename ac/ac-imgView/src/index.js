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
            url: 'https://www.w3schools.com/css/img_lights.jpg',
            categories: []
          },
          {
            url:
              'https://s3-us-west-1.amazonaws.com/powr/defaults/image-slider2.jpg',
            categories: ['landscape', 'animal']
          },
          {
            url:
              'https://s3-us-west-1.amazonaws.com/powr/defaults/image-slider2.jpg',
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

export default ({
  id: 'ac-imgView',
  type: 'react-component',
  meta,
  config,
  ActivityRunner
}: ActivityPackageT);
