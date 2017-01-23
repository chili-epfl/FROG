import { Mongo } from 'meteor/mongo'
import { uuid } from 'frog-utils'

export const Graphs = new Mongo.Collection('graphs')

export const addGraph = (name = 'untitled') => {
  const id = uuid()
  Graphs.insert({ _id: id, name, createdAt: new Date() })
  return id
}

export const importGraph = (params) => {
  const id = params._id
  Graphs.insert({...params, _id: id, createdAt: new Date() })
  return(id)
}

export const renameGraph = (graphId, name) =>
  Graphs.update({ _id: graphId }, { $set: { name } })
