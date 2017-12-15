// @flow
export const config = {
  type: 'object',
  properties: {
    boards: {
      title: 'Boards',
      type: 'array',
      items: {
        type: 'object',
        title: 'Board',
        properties: {
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
      }
    },
    noteTypes: {
      title: 'Note Types',
      type: 'array',
      items: {
        type: 'object',
        title: 'Notes',
        properties: {
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
      }
    },
    classTags: {
      title: 'Class Tag set',
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
};
