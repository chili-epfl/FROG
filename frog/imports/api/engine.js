import { Meteor } from 'meteor/meteor';

import { Activities, Connections, Operators } from './activities';
import {
  Sessions,
  updateSessionState,
  updateSessionActivity
} from './sessions';
import { engineLogger } from './logs';
import { Products, addNodeProduct } from './products';

import { operatorTypesObj } from '../operatorTypes';

export const runSession = sessionId => Meteor.call('run.session', sessionId);
export const nextActivity = sessionId =>
  Meteor.call('next.activity', sessionId);

Meteor.methods({
  'run.session': sessionId => {
    updateSessionState(sessionId, 'STARTED');
    engineLogger(sessionId, { message: 'STARTING SESSION' });
  },
  'next.activity': sessionId => {
    const activities = Activities.find({ sessionId }).fetch().sort(
      // Sort the list according to startTime of activities
      (a1, a2) => a1.startTime - a2.startTime
    );
    const session = Sessions.findOne({ _id: sessionId });
    // If no activity has been started, we start the first activity (activities[0])
    if (!session.activityId) {
      updateSessionActivity(sessionId, activities[0]._id);
    }
    activities.forEach((ac, index) => {
      // If it is the current activity and not the last activity, we start the next activity (index + 1)
      if (ac._id === session.activityId && index + 1 < activities.length) {
        updateSessionActivity(sessionId, activities[index + 1]._id);
      }
    });
    engineLogger(sessionId, { message: 'NEXT ACTIVITY' });
  },
  'run.dataflow': (type, nodeId, sessionId) => {
    // Find the operators that need to be ran for the current activity
    const types = { operator: Operators, activity: Activities };
    const node = types[type].findOne({ _id: nodeId });
    if (!node.computed) {
      engineLogger(sessionId, { message: 'COMPUTING DATA FOR ITEM ' + nodeId });
      const connections = Connections.find({ 'target.id': nodeId }).fetch();
      connections.forEach(connection =>
        Meteor.call(
          'run.dataflow',
          connection.source.type,
          connection.source.id,
          sessionId
        ));
      // Now everything must have been computed, let's compute the new data
      if (type === 'operator') {
        // The list of students
        const students = Meteor.users.find({
          'profile.currentSession': sessionId
        }).fetch();
        // The list of social structure for every connected node
        const socialStructures = connections.map(
          connection => students.map(student => ({
            studentId: student._id,
            attributes: student.profile.attributes[connection.source.id]
          }))
        );

        // The list of products of every connected node
        const products = connections.map(connection =>
          Products.find({ nodeId: connection.source.id }).fetch());

        // More data needed by the operators. Will need to be completed, documented and typed if possible
        const globalStructure = {
          studentIds: students.map(student => student._id)
        };

        // We get the operator function from the operator package
        const operatorFunction = operatorTypesObj[node.operatorType].operator;

        // We run the operator function
        const { product, socialStructure } = operatorFunction(
          products,
          socialStructures,
          globalStructure
        );

        // The result of the operator function are written in Mongo
        product.forEach(data => addNodeProduct(nodeId, data));
        socialStructure.forEach(({ studentId, attributes }) => {
          const att = {};
          att['profile.attributes.' + nodeId] = attributes;
          Meteor.users.update({ _id: studentId }, { $set: att });
        });
      }
      if (type === 'activity') {
        // Here we build the object of an activity from the products of its connected nodes
      }
      types[type].update({ _id: nodeId }, { $set: { computed: true } });
    }
  }
});
