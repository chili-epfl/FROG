// @flow

import { type ActivityPackageT } from 'frog-utils';

import dashboardText from './DashboardText';
import dashboardRank from './DashboardRank';

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

const config = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Title'
    },
    multi: {
      type: 'boolean',
      title: 'Multiple color highlights'
    },
    text: {
      type: 'string',
      title: 'Text'
    }
  }
};

const configUI = {
  text: {
    'ui:widget': 'textarea',
    'ui:options': {
      rows: 5
    }
  }
};

export default ({
  id: 'ac-select',
  type: 'react-component',
  configVersion: 1,
  meta,
  config,
  configUI,
  dashboards: { Ranking: dashboardRank, Text: dashboardText }
}: ActivityPackageT);
