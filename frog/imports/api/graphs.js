import { Mongo } from 'meteor/mongo';
import { uuid } from 'frog-utils'
 
export const Graphs = new Mongo.Collection('graphs');

export const addOrUpdateGraph = (graph) => {
  Graphs.remove(graph._id)
  Graphs.insert(graph)
}
