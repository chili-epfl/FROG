// @flow

import type { productOperatorT } from 'frog-utils';

const meta = {
  name: 'Social->config',
  shortDesc: 'Match config to social structure',
  description:
    'Send different values for a config field based on a social structure'
};

const config = {
  type: 'object',
  required: ['socialAttribute', 'path', 'matchings'],
  properties: {
    socialAttribute: { title: 'Grouping', type: 'socialAttribute' },
    path: {
      type: 'string',
      title: 'Key to set (for example `title`)'
    },
    provideDefault: { type: 'boolean', title: 'Provide default value' },
    defaultValue: { type: 'string', title: 'Default value' },
    matchings: {
      type: 'array',
      title: 'Match different contents with different social attribute values',
      items: {
        type: 'object',
        required: ['socialValue', 'configValue'],
        properties: {
          socialValue: { type: 'string', title: 'Social attribute value' },
          configValue: {
            type: 'string',
            title:
              'Config value for this social attribute, for the path listed above'
          }
        }
      }
    }
  }
};

const configUI = { defaultValue: { conditional: 'provideDefault' } };

const operator = (configData, object) => {
  const findMatching = attrib => {
    const matching = configData.matchings.find(x => x.socialValue === attrib);
    if (matching) {
      return matching.configValue;
    }
    if (configData.provideDefault) {
      return configData.default;
    } else {
      return null;
    }
  };
  const payload = Object.keys(
    object.socialStructure[configData.socialAttribute]
  ).reduce(
    (acc, x) => ({
      ...acc,
      [x]: { config: { [configData.path]: findMatching(x) } }
    }),
    {}
  );
  return { structure: { groupingKey: configData.socialAttribute }, payload };
};

export default ({
  id: 'op-social-config',
  type: 'product',
  operator,
  config,
  configUI,
  meta
}: productOperatorT);
