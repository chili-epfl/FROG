import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { uuid } from 'frog-utils';
import { omitBy, isNil, forIn } from 'lodash';

import { operatorTypesObj } from '../operatorTypes';
import { activityTypesObj } from '../activityTypes';
import { Graphs } from './graphs';
import { Products } from './products';
import { Sessions } from './sessions';
import { Operators, Activities } from './activities';
import { engineLogger } from './logs';

const runAllConnecting = nodeId => {
  const connections = Connections.find({
    'target.id': nodeId
  }).fetch();
  connections.forEach(connection =>
    runDataflow(connection.source.type, connection.source.id, sessionId)
  );
  return connections;
};

// the opposite of focusRole
// translates from {group: {'1': ['stian']}, role: {'chief': ['stian', 'ola', 'jens'], carpenter: ['anna']}}
// to: {anna: { role: 'carpenter' }, jens: { role: 'chief' }, ola: { role: 'chief' }, stian: { group: '1', role: 'chief' }}
const focusStudent = structure => {
  let newStruct = {};
  forIn(structure, (attrPairs, grouping) => {
    forIn(attrPairs, (k, v) => {
      k.forEach(
        student =>
          (newStruct[student] = { ...newStruct[student], [grouping]: v })
      );
    });
  });
  return newStruct;
};

// the opposite of focusStudent
// translates from {anna: { role: 'carpenter' }, jens: { role: 'chief' }, ola: { role: 'chief' }, stian: { group: '1', role: 'chief' }}
// to: {group: {'1': ['stian']}, role: {'chief': ['stian', 'ola', 'jens'], carpenter: ['anna']}}
const focusRole = structure => {
  let newStruct = {};
  forIn(structure, (attrPairs, student) => {
    forIn(attrPairs, (k, v) => {
      newStruct[v] = {
        [k]: [...(newStruct[v] ? newStruct[v][k] : []), student]
      };
    });
  });
  return newStruct;
};

// merges social structures, assumes no top level keys (groupings) overlap
const mergeSocialStructures = structures =>
  structures.reduce((acc, k) => ({ ...acc, ...k }), {});

// The list of students
const getStudents = sessionId =>
  Meteor.users.find({ 'profile.currentSession': sessionId }).fetch();

// runDataflow ensures that all data required for a given node is
// computed. It recursively runs all the connecting nodes, and
// then the current node.
const runDataflow = (type, nodeId, sessionId) => {
  const types = { operator: Operators, activity: Activities };
  const node = types[type].findOne(nodeId);
  if (node.computed) {
    // we're done here
    return;
  }

  // first make sure all incoming nodes have been computed
  const connections = runAllConnecting(node._id);

  const students = getStudents(sessionId);

  // Retrieve and merge all social structures
  const socialStructures = connections.filter(c => c.type === 'social').map(conn =>
    Products.findOne(connection.source.id).fetch()
  )
  const socialStructure = mergeSocialStructures(socialStructures)
    
    
    
    => {
    const socialStructure: SocialStructureT = {};
    students.forEach(student => {
      socialStructure[student._id] = student.profile.attributes
        ? student.profile.attributes[connection.source.id]
        : {};
    });
    return socialStructure;
  });

  // The list of products of every connected node
  const products: Array<Array<ProductT>> = connections.map(connection =>
    Products.find({
      nodeId: connection.source.id
    }).fetch()
  );

  // More data needed by the operators. Will need to be completed, documented and typed if possible
  const globalStructure = {
    studentIds: students.map(student => student._id)
  };

  const object: ObjectT = {
    products,
    socialStructures,
    globalStructure
  };

  if (type === 'operator') {
    // We get the operator function from the operator package
    const operatorFunction = operatorTypesObj[node.operatorType].operator;
    // We run the operator function
    const { product, socialStructure } = operatorFunction(node.data, object);
    // The result of the operator function are written in Mongo
    product.forEach(data => addNodeProduct(nodeId, data, ''));
    Object.keys(socialStructure).forEach(studentId => {
      const att = {};
      att['profile.attributes.' + nodeId] = socialStructure[studentId];
      Meteor.users.update(studentId, { $set: att });
    });
  }
  if (type === 'activity') {
    // Here we build the object of an activity from the products of its connected nodes
    addObject(nodeId, object);
  }
  types[type].update(nodeId, { $set: { computed: true } });
};

export default runDataflow;
