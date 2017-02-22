// @flow

import type { ObjectT, SocialStructureT } from 'frog-utils'

export const meta = {
  name: 'Argue',
  type: 'social'
}

export const config = {
  title: 'Configuration for Argue',
  type: 'object',
  properties: {
  }
}

const randomChoice = array =>{
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

export const operator = (config: Object, object: ObjectT) => {
  const { products, socialStructures, globalStructure } = object

  const socStruc: SocialStructureT = {}
  globalStructure.studentIds.forEach((studentId, index) => { 
  	socStruc[studentId] = { 
      group: Math.floor(index / 2).toString()
    }
  })
  return {
  	product: [],
  	socialStructure: socStruc
  }
}

export default { id: 'op-argue', operator: operator, config: config, meta: meta }
