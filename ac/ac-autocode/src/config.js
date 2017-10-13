// @flow

//Description of the config for the activity
export const config = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Title of the activity'
    },
    guidelines: {
      type: 'string',
      title: 'Guidelines'
    },
    multipleTry: {
      title: 'Can student submit multiple times ?',
      type: 'boolean'
    },
    numTry: {
      title: 'Number of submission allowed (0 for no limit):',
      type: 'number'
    }
  }
};

export const configUI = {
  numTry: {
    conditional: 'multipleTry'
  }
};
