// @flow
import { testData } from './testData';

const exampleConfig = {
  boards: [
    {
      id: {
        type: 'string',
        title: 'Id'
      },
      title: {
        type: 'string',
        title: 'Title'
      },
      noteTypes: {
        type: 'string',
        title: 'Note types seperated by comma'
      },
      tagging: {
        title: 'Tagging',
        type: 'boolean'
      },
      voting: {
        title: 'Voting',
        type: 'boolean'
      },
      boardTags: {
        title: 'Board Tags',
        type: 'array',
        items: {
          type: 'object',
          title: 'Tags',
          properties: {
            id: {
              type: 'string',
              title: 'Id'
            },
            title: {
              type: 'string',
              title: 'Label'
            }
          }
        }
      }
    }
  ],
  noteTypes: [
    {
      type: 'object',
      title: 'Notes',
      noteType: {
        type: 'string',
        title: 'Note Type'
      },
      prompt: {
        type: 'string',
        title: 'Prompt'
      },
      sentenceStarter: {
        type: 'string',
        title: 'Sentence Starter'
      }
    }
  ],
  classTags: [
    {
      id: {
        type: 'string',
        title: 'Id'
      },
      title: {
        type: 'string',
        title: 'Label'
      }
    }
  ]
};
export const meta = {
  name: 'CK Student View',
  shortDesc: 'CK Student View',
  description: 'CK Student View',
  exampleData: [
    { title: 'CK-Student with no data', config: exampleConfig, data: [] },
    { title: 'Case with with data', config: exampleConfig, data: [testData] }
  ]
};
