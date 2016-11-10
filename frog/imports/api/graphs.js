import { Mongo } from 'meteor/mongo';
import { uuid } from 'frog-utils'
 
export const Graphs = new Mongo.Collection('graphs');

export const addActivity = () =>
  Graphs.insert({
    _id: uuid(),
    created_at: new Date() 
  })
