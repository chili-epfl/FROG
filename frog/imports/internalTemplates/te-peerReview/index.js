// @flow

import p1 from './p1';
import p2 from './p2';

export const config = {
  type: 'object',
  properties: {
    general: {
      type: 'object',
      title: 'General settings',
      description: '',
      properties: {
        plane: {
          description:
            'Students can do their writing individually or in groups. The groups will be automatically created. The students will also do the peer-reviews either individually or in groups, based on the choice made here',
          title: 'Individual or group writing',
          type: 'string',
          enum: ['individual', 'group'],
          default: 'individual'
        }
      }
    },
    first: {
      type: 'object',
      title: 'Stage 1, authoring',
      description: 'Students are asked to write, individually or in groups',
      properties: {
        instructions: {
          type: 'rte',
          title: 'Initial writing prompt'
        }
      }
    },
    second: {
      type: 'object',
      title: 'Stage 2, peer-review',
      description:
        'Students see one or several written products from other students, and are asked to review/provide feedback according to a prompt',
      properties: {
        reviewCount: {
          title: 'Review count',
          description: 'How many items should each student/group review',
          type: 'number',
          default: 1
        },
        reviewPrompt: {
          title: 'Review prompt',
          type: 'rte',
          description:
            'Prompt shown to students when they are providing feedback'
        }
      }
    },
    third: {
      type: 'object',
      title: 'Stage 3, revision',
      description:
        'Students see the feedback from other students/groups, and are able to continue revising their own texts',
      properties: {
        reviseInstructions: {
          title: 'Revision prompt',
          type: 'rte',
          description:
            'Prompt shown to students when they are revising their own products'
        }
      }
    },

    fourth: {
      type: 'object',
      title: 'Stage 4, debrief',
      description:
        "Written products are shown on the projector, and optionally on students' screens",
      properties: {
        alsoShowStudents: {
          title: "Also show all products on students's screens",
          type: 'boolean'
        }
      }
    }
  }
};

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
  const template = JSON.stringify(conf.general?.plane === 'group' ? p2 : p1);
  const replacements = {
    instructions: conf.first?.instructions || '',
    reviewPrompt: conf.second?.reviewPrompt || '',
    reviseInstructions: conf.third?.reviseInstructions || '',
    reviewCount: conf.second?.reviewCount || 1,
    participationMode: conf.fourth?.alsoShowStudents ? 'everyone' : 'projector'
  };
  return [
    processTemplate(template, replacements),
    conf.general?.plane === 'individual' ? p1Instructions : p2Instructions
  ];
};

const meta = {
  name: 'Peer review flow',
  shortDesc: `Students write, review their peers' contributions, and revise their own texts`,
  description: `This template generates a peer review flow with four stages:
    
 - **Stage 1**: Students (individually or in random groups) are presented with a writing prompt, and can use a rich-text editor to write their contribution
 - **Stage 2**: In the next stage, they receive one or several of the contributions from their peers (individuals or groups), and are asked to comment based on a review prompt.
 - **Stage 3**: Students then receive the feedback from other students, and can continue to work on their contributions, taking into account the feedback from the other students
 - **Stage 4**: Finally, all contributions are sent to the projector for the teacher to discuss and debrief.

 ![Screenshots](/clientFiles/te-peerReview/te-peerReview.png)`
};

export default {
  id: 'te-peerReview',
  config,
  meta,
  makeTemplate,
  type: 'template'
};
