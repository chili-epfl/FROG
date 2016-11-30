import { Mongo } from 'meteor/mongo';
import { uuid } from 'frog-utils'
 
export const Graphs = new Mongo.Collection('graphs');

export const addGraph = () => {
  const id = uuid()
  Graphs.insert({
    _id: id,
    name: 'untitled',
    created_at: new Date()
  })
  return(id)
}

export const renameGraph = (graphId, name) => {
  Graphs.update({ _id: graphId },{ $set: { name: name } })
}
