// @flow

import { type ActivityPackageT } from 'frog-utils';

import ActivityRunner from './imgClassifier';

const meta = {
  name: 'Image Classifier',
  type: 'react-component',
  shortDesc: 'Quickly display images to classify',
  description:
    'Show to the student images one after the other and the student has to choose what category is the most appropriated one',
  exampleData: [
    { title: 'Case with no data', config: { title: 'No data' }, data: {} },
    {
      title: 'Case with data',
      config: {
        title: "Decide if it's a landscape or an animal",
        images: [
          'https://tuswallpapersgratis.com/wp-content/plugins/download-wallpaper-resized/wallpaper.php?x=1600&y=900&file=https://tuswallpapersgratis.com/wp-content/uploads/2013/02/Playa_Paradisiaca_1280x800-46768.jpeg',
          'https://s3-us-west-1.amazonaws.com/powr/defaults/image-slider2.jpg',
          'https://www.smashingmagazine.com/wp-content/uploads/2015/06/10-dithering-opt.jpg',
          'https://www.w3schools.com/w3images/fjords.jpg'
        ],
        categories: ['landscape', 'animal']
      },
      data: {}
    }
  ]
};

const config = {
  type: 'object',
  properties: {
    title: {
      title: 'What is the title?',
      type: 'string'
    },
    images: {
      title: 'Images to display',
      type: 'array',
      items: {
        type: 'string',
        title: 'Image URL'
      }
    },
    categories: {
      title: 'Categories',
      type: 'array',
      items: {
        type: 'string',
        title: 'Category'
      }
    }
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = (object, dataFn) => {
  dataFn.objInsert(0, 'index');
  if (object.config.images)
    object.config.images.forEach((x, i) =>
      dataFn.objInsert({ url: x, category: '' }, i)
    );

  if (object.data === null || Array.isArray(object.data)) return;
  const dataImgs = Object.keys(object.data).filter(
    x => object.data[x].url !== undefined
  );

  if (object.data !== {})
    dataImgs.forEach((x, i) =>
      dataFn.objInsert(
        { url: object.data[x].url, category: '' },
        object.config.images ? object.config.images.length + i : i
      )
    );
};

export default ({
  id: 'ac-imgClass',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  Dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
