export const config = {
  type: 'object',
  required: ['who', 'social'],
  properties: {
    applytoall: {
      type: 'boolean',
      title: 'Apply to all activities?',
      default: true
    },
    social: {
      type: 'socialAttribute',
      title: 'Social attribute'
    },
    individuals: {
      type: 'boolean',
      title: 'Apply to individuals instead of groups'
    },
    includeexclude: {
      type: 'string',
      title: 'Include or exclude students',
      enum: ['include', 'exclude'],
      default: 'include'
    },
    who: {
      type: 'string',
      title: 'List of individuals/groups to include/exclude, separated by comma'
    },
    rules: {
      title: 'Rules',
      type: 'array',
      items: {
        type: 'object',
        title: 'New Rule',
        required: ['activity', 'who'],
        properties: {
          activity: {
            type: 'targetActivity',
            title: 'Applies to which activity'
          },
          includeexclude: {
            type: 'string',
            title: 'Include or exclude individuals',
            enum: ['include', 'exclude'],
            default: 'include'
          },
          who: {
            type: 'string',
            title:
              'List of individuals/groups to include/exclude, separated by comma'
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
  social: { conditional: formdata => !formdata.individuals },
  includeexclude: { conditional: 'applytoall' },
  who: { conditional: 'applytoall' }
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
