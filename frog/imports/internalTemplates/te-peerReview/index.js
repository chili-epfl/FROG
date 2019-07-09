// @flow

import p1 from './p1';
import p2 from './p2';

export const config = {
  type: 'object',
  properties: {
    plane: {
      type: 'object',
      description:
        'Students can do their writing individually or in groups. The groups will be automatically created. The students will also do the peer-reviews either individually or in groups, based on the choice made here',
      title: 'Individual or group writing',
      properties: {
        plane: {
          type: 'string',
          enum: ['individual', 'group'],
          default: 'individual'
        }
      }
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

// export const config = {
//   type: 'object',
//   properties: {
//     general: {
//       type: 'object',
//       title: 'General',
//       description: 'Specify the title and text content of the activity',
//       properties: {
//         title: {
//           type: 'object',
//           description: 'The title is key, try to make it memorable',
//           properties: {
//             title: {
//               type: 'string',
//               title: 'Title'
//             },
//             text: {
//               type: 'rte',
//               title: 'Text'
//             }
//           }
//         }
//       }
//     }
//   }
// };

const p1Instructions = {
  '7_5': 'Students are asked to work on a text given the initial instructions',
  '18_5':
    'Students receive one or several texts from other students, and are asked to comment/review them given the instructions',
  '26_5':
    'Students see the feedback from their peers, and have the opportunity to continue revising their texts',
  '36_5':
    'Open the Projector View to display all the student contributions on the projector'
};

const p2Instructions = {
  '4_5':
    'Please make sure all students are logged in before continuing. After this step, no additional students may join the lesson',
  '9_5':
    'Groups of students are asked to work on a text given the initial instructions',
  '21_5':
    'Groups receive one or several texts from other groups, and are asked to comment/review them given the instructions',
  '29_5':
    'Groups see the feedback from their peers, and have the opportunity to continue revising their texts',
  '39_5':
    'Open the Projector View to display all the group contributions on the projector'
};

const processTemplate = (template, replacements) => {
  const result = Object.keys(replacements).reduce((acc, x) => {
    const toReplace = Number.isInteger(replacements[x])
      ? replacements[x]
      : `"${replacements[x]}"`;
    return acc.replace(`"{{${x}}}"`, toReplace);
  }, template);
  return [result];
};

const makeTemplate = conf => {
  const template = JSON.stringify(conf.plane === 'individual' ? p1 : p2);
  const replacements = {
    instructions: conf.instructions || '',
    reviewPrompt: conf.reviewPrompt || '',
    reviseInstructions: conf.reviseInstructions || '',
    reviewCount: conf.reviewCount || 1
  };
  return [
    processTemplate(template, replacements),
    conf.plane === 'individual' ? p1Instructions : p2Instructions
  ];
};

const meta = {
  name: 'Peer review template',
  shortDesc: `Students write, review their peers' contributions, and revise their own texts`,
  description:
    'Students (individually or in random groups) are presented with a writing prompt, and can use a rich-text editor to write their contribution. In the next stage, they receive one or several of the contributions from their peers (individuals or groups), and are asked to comment based on a review prompt. Students then receive the feedback from other students, and can continue to work on their contributions, taking into account the feedback from the other students. Finally, all contributions are sent to the projector for the teacher to discuss and debrief.'
};

export default {
  id: 'te-peerReview',
  config,
  meta,
  makeTemplate,
  type: 'template'
};
