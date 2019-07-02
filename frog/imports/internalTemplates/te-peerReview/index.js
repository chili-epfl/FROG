// @flow

import p1 from './p1';
import p2 from './p2';

export const config = {
  type: 'object',
  properties: {
    plane: {
      type: 'string',
      title: 'Individual or group writing',
      enum: ['individual', 'group'],
      default: 'individual'
    },
    instructions: { type: 'rte', title: 'Initial writing prompt' },
    reviewCount: {
      title: 'How many items should each student/group review',
      type: 'number',
      default: 1
    },
    reviewPrompt: { title: 'Review prompt', type: 'rte' },
    reviseInstructions: { title: 'Revision prompt', type: 'rte' }
  }
};

// showAll: {
//   type: 'boolean',
//   title: 'Send all contributions to the projector after revising?'
// }
//
const p1Instructions = {
  '7_5': 'Students are asked to work on a text given the initial instructions',
  '18_5':
    'Students receive one or several texts from other students, and are asked to comment/review them given the instructions',
  '26_5':
    'Students see the feedback from their peers, and have the opportunity to continue revising their texts',
  '36_5':
    'Open the Projector View to display all the student contributions on the projector'
};

const processTemplate = (template, replacements) => {
  const result = Object.keys(replacements).reduce((acc, x) => {
    const toReplace = Number.isInteger(replacements[x])
      ? replacements[x]
      : `"${replacements[x]}"`;
    return acc.replace(`"{{${x}}}"`, toReplace);
  }, template);
  return [result, p1Instructions];
};

const makeTemplate = config => {
  const template = JSON.stringify(config.plane === 'individual' ? p1 : p2);
  const replacements = {
    instructions: config.instructions || '',
    reviewPrompt: config.reviewPrompt || '',
    reviseInstructions: config.reviseInstructions || '',
    reviewCount: config.reviewCount || 1
  };
  return processTemplate(template, replacements);
};

const meta = {
  name: 'Peer review template',
  shortDesc: `Students write, review their peers' contributions, and revise their own texts`
};

export default { id: 'te-peerReview', config, meta, makeTemplate };
