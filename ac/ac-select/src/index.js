// @flow

import { type ActivityPackageT, uuid } from 'frog-utils';

import dashboardText from './DashboardText';
import liType from './liType';

const meta = {
  name: 'Words selection',
  shortDesc: 'Reading a text and selecting some words in the text',
  description:
    'Allow the student to select words that are highlighted int the text displayed.',
  exampleData: [
    {
      title: 'Sample text',
      config: {
        title: 'Lorem Ipsum',
        text:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\n Why do we use it?\n It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).\n\n Where does it come from?\n Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32."
      },
      activityData: {}
    }
  ]
};

const ColorOptions = [
  ['#FFFFFF', 'White'],
  ['#FFFF00', 'Yellow'],
  ['#FF0000', 'Red'],
  ['#0000FF', 'Blue'],
  ['#32CD32', 'Green']
];

const translateColor = hex => ColorOptions.find(x => x[0] === hex)?.[1];

const formatProduct = (_, product, instanceId, user) => {
  if (product.highlighted) {
    return Object.keys(product.highlighted).reduce((acc, x) => {
      const id = uuid();
      return {
        ...acc,
        [id]: {
          id,
          category: translateColor(product.highlighted[x].color),
          user,
          li: {
            liDocument: {
              liType: 'li-wordSelect',
              createdAt: new Date(),
              createdByUser: instanceId,
              createdBy: 'ac-select',
              payload: { word: x, color: product.highlighted[x].color }
            }
          }
        }
      };
    }, {});
  } else {
    return {};
  }
};

const config = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Title'
    },
    text: {
      type: 'string',
      title: 'Text'
    },
    multi: {
      type: 'boolean',
      title: 'Color each highlighted word differently'
    },
    chooseColor: {
      type: 'boolean',
      title: 'Let students choose which color to use for highlighting'
    }
  }
};

const configUI = {
  text: {
    'ui:widget': 'textarea',
    'ui:options': {
      rows: 5
    }
  },
  multi: { conditional: formData => !formData.chooseColor },
  chooseColor: { conditional: formData => !formData.multi }
};

const dataStructure = { highlighted: {}, currentColor: '#FFFF00' };

export default ({
  id: 'ac-select',
  type: 'react-component',
  configVersion: 1,
  dataStructure,
  meta,
  config,
  configUI,
  formatProduct,
  dashboards: { Dashboard: dashboardText },
  LearningItems: [liType]
}: ActivityPackageT);
