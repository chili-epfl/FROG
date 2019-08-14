// @flow

import p1 from './p1';
import p2 from './p2';

// instructions
// participationMode
// numGroups int
// matchings ary
//           { socialValue: '1', configValue: 'Hello' },
//           { socialValue: '2', configValue: 'Hello2' }

// p2 groupSize int

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
            "Students can do their writing individually or in groups. The groups will be automatically created. After writing, the teacher can display all the texts on the projector (optionally, the texts can also be shown on the students' screens)",
          title: 'Individual or group writing',
          type: 'string',
          enum: ['individual', 'group'],
          default: 'individual'
        }
      }
    },
    first: {
      type: 'object',
      title: 'First phase, authoring',
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
      title: 'Second phase, debrief',
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
  '18_5':
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
  const template = JSON.stringify(
    conf.general?.plane === 'individual' ? p1 : p2
  );
  const replacements = {
    instructions: conf.first?.instructions || '',
    reviewPrompt: conf.second?.reviewPrompt || '',
    reviseInstructions: conf.third?.reviseInstructions || '',
    reviewCount: conf.second?.reviewCount || 1
  };
  return [
    processTemplate(template, replacements),
    conf.general?.plane === 'individual' ? p1Instructions : p2Instructions
  ];
};

const meta = {
  name: 'Peer review template',
  shortDesc: `Students write, review their peers' contributions, and revise their own texts`,
  description: `This template generates a peer review flow with four stages:
    
 - **Stage 1**: Students (individually or in random groups) are presented with a writing prompt, and can use a rich-text editor to write their contribution
 - **Stage 2**: In the next stage, they receive one or several of the contributions from their peers (individuals or groups), and are asked to comment based on a review prompt.
 - **Stage 3**: Students then receive the feedback from other students, and can continue to work on their contributions, taking into account the feedback from the other students
 - **Stage 4**: Finally, all contributions are sent to the projector for the teacher to discuss and debrief.

 ![Screenshots](/clientFiles/te-peerReview/te-peerReview.png)`
};

export default {
  id: 'te-writing',
  config,
  meta,
  makeTemplate,
  type: 'template'
};
