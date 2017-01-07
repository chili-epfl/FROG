import { Mongo } from 'meteor/mongo';
import { uuid } from 'frog-utils'
 
export const Graphs = new Mongo.Collection('graphs');

export const addGraph = (name='untitled') => {
  const id = uuid()
  Graphs.insert({
    _id: id,
    name: name,
    created_at: new Date()
  })
  return(id)
}

export const renameGraph = (graphId, name) => {
  Graphs.update({ _id: graphId },{ $set: { name: name } })
}

export const removeGraph = ( graphId ) =>
  Meteor.call('graph.flush.all', graphId)

export const setCurrentGraph = (graphId) => {
  Meteor.users.update({_id:Meteor.userId()},{$set: {'profile.editingGraph': graphId}})
}