// @flow

import { isObject, isBoolean, isNumber } from 'lodash';

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
      title: 'Stage 1, authoring',
      description: 'Students are asked to write, individually or in groups',
      properties: {
        instructions: { type: 'string', title: 'Initial writing propmpt' },
        instructionAry: {
          type: 'array',
          default: [''],
          minItems: 1,
          title:
            'Initial writing prompt. If you add several prompts, each student will be randomly assigned a prompt',
          items: { type: 'rte', default: '' }
        }
      }
    },
    second: {
      type: 'object',
      title: 'Stage 2, debrief',
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

const configUI = {
  'first.instructionAry': {
    'ui:options': {
      orderable: false
    },
    conditional: (formData: Object) => formData.general?.plane !== 'group'
  },
  'first.instructions': {
    conditional: (formData: Object) => formData.general?.plane === 'group'
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
    const val = replacements[x];
    const toReplace =
      isObject(val) || isBoolean(val) || Array.isArray(val)
        ? JSON.stringify(val)
        : isNumber(val)
        ? val
        : // $FlowFixMe
          `"${val}"`;
    // $FlowFixMe
    return acc.replace(`"{{${x}}}"`, toReplace);
  }, template);
  return [result];
};

const makeTemplate = (conf: Object) => {
  const template = JSON.stringify(conf.general?.plane === 'group' ? p2 : p1);

  let matchings;
  if (conf.first?.instructionAry) {
    matchings = conf.first.instructionAry.reduce((acc, inst, i) => {
      acc.push({ socialValue: i + 1 + '', configValue: inst });
      return acc;
    }, []);
  } else {
    matchings = [{ socialValue: '1', configValue: '<p></p>' }];
  }

  const replacements = {
    numGroups: conf.first?.instructionAry?.length || 1,
    participationMode: conf.second?.alsoShowStudents ? 'everyone' : 'projector',
    instructions: conf.first?.instructions,
    useInstructions:
      conf.first?.instructionAry?.length &&
      conf.first.instructionAry.length > 1,
    matchings
  };
  return [
    processTemplate(template, replacements),
    conf.general?.plane === 'group' ? p2Instructions : p1Instructions
  ];
};

const meta = {
  name: 'Writing and sharing',
  shortDesc: `Students write individually or in groups, and share with the whole class`,
  description: `
    
 - **Stage 1**: Students (individually or in random groups) are presented with a writing prompt, and can use a rich-text editor to write their contribution. Optionally, different students get different prompts.
 - **Stage 2**: All contributions are shown on the projector, and optionally on the students' screens.`
};

export default {
  id: 'te-writing',
  config,
  configUI,
  meta,
  makeTemplate,
  type: 'template'
};
