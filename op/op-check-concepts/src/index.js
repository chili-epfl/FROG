// @flow

import type { productOperatorT } from 'frog-utils';

const meta = {
  name: 'Provide feedback based on concepts in text',
  shortName: 'Feedback',
  shortDesc: 'Group students to argue',
  description: 'Group students with as many similar answers as possible.'
};

const config = {
  type: 'object',
  properties: {
    concepts: {
      type: 'array',
      title: 'Concepts',
      items: {
        type: 'object',
        required: ['keyword', 'prompt'],
        properties: {
          keyword: {
            type: 'string',
            title:
              'Keywords to look for in text, comma separated, * for any letters until space, for example creat* matches creation and creativity'
          },
          prompt: {
            type: 'string',
            title: 'Prompt to provide if keywords are missing'
          }
        }
      }
    }
  }
};

const mapData = (aD, fn) => {
  const payload = aD.payload;
  const newPayload = Object.keys(payload).reduce(
    (acc, instance) => ({ ...acc, [instance]: fn(payload[instance]) }),
    {}
  );
  return { ...aD, payload: newPayload };
};

const getPrompt = (configData, item) => {
  const prompts = [];
  configData.concepts.forEach(concept => {
    if (
      !concept.keyword
        .split(',')
        .map(y => y.trim())
        .some(word => item.text.includes(word))
    ) {
      prompts.push(concept.prompt);
    }
  });
  return prompts.join('\n');
};

const operator = (configData, object) => {
  const { activityData } = object;
  return mapData(activityData, item => ({
    ...item,
    config: { prompt: getPrompt(configData, item.data) }
  }));
};

export default ({
  id: 'op-check-concepts',
  type: 'product',
  operator,
  config,
  meta
}: productOperatorT);
