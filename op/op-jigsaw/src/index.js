export const meta = {
  name: 'Jigsaw',
  type: 'social'
};

export const config = {
  type: 'object',
  properties: {
    roles: {
      type: 'string',
      title: 'Comma-separated list of roles'
    },
    mix: {
      type: 'boolean',
      title: 'Mix previous groups?'
    }
  }
};

const taxi = ['Stian', 'Peter', 'Nils'];
const consumer = ['Ahmed', 'Chen Li', 'Ragnar'];
const policy = ['Khanittra', 'Jean', 'Alphons'];
const roles = [
  ...taxi.map((x, i) => [x, i, 'taxi drivers']),
  ...consumer.map((x, i) => [x, i, 'consumers']),
  ...policy.map((x, i) => [x, i, 'policy makers'])
];

export const operator = (configData: Object, object: ObjectT) => {
  const temp = object.globalStructure.studentIds.map(studentId => {
    const username = Meteor.users.findOne(studentId).username;
    const info = roles.find(x => x[0] === username) || [, 'norole', 'nogroup'];

    return { [studentId]: { role: info[2], group: info[1] + 1 } };
  });
  const socStruct = temp.reduce((acc, x) => ({ ...acc, ...x }), {});
  return {
    product: [],
    socialStructure: socStruct
  };
};

export default {
  id: 'op-jigsaw',
  operator,
  config,
  meta
};
