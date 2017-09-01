export const config = {
  type: 'object',
  required: ['individuals'],
  properties: {
    applytoall: {
      type: 'boolean',
      title: 'Apply to all activities?',
      default: true
    },
    includeexclude: {
      type: 'string',
      title: 'Include or exclude individuals',
      enum: ['include', 'exclude'],
      default: 'include'
    },
    individuals: {
      type: 'string',
      title: 'List of individuals to include/exclude, separated by comma'
    },
    rules: {
      title: 'Rules',
      type: 'array',
      items: {
        type: 'object',
        title: 'New Rule',
        required: ['activity', 'individuals'],
        properties: {
          activity: {
            type: 'activity',
            title: 'Applies to which activity'
          },
          includeexclude: {
            type: 'string',
            title: 'Include or exclude individuals',
            enum: ['include', 'exclude'],
            default: 'include'
          },
          individuals: {
            type: 'string',
            title: 'List of individuals to include/exclude, separated by comma'
          }
        }
      }
    }
  }
};

export const configUI = {
  rules: {
    conditional: formdata => !formdata.applytoall
  },
  includeexclude: { conditional: 'applytoall' },
  individuals: { conditional: 'applytoall' }
};

export const validateConfig = [
  data => {
    if (data.rules.map(rule => rule.activity === '')) {
      return {
        field: 'activity',
        err: 'No activity fields can be empty, remove the rule'
      };
    }
  },
  data => {
    if (data.rules.map(rule => rule.activity === '')) {
      return {
        field: 'activity',
        err: 'No activity fields can be empty, remove the rule'
      };
    }
  }
];
