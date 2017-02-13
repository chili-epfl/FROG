// @flow
import type { ObjectT, SocialStructureT } from 'frog-utils'

export const meta = {
  name: 'Jigsaw',
  type: 'social'
}

export const config = {
  title: 'Configuration for Jigsaw',
  type: 'object',
  properties: {
  }
}

export const operator = (config: Object, object: ObjectT) => {
  const { products, socialStructures, globalStructure } = object

  const socStruc: SocialStructureT = {}
  globalStructure.studentIds.forEach(studentId => { 
  	socStruc[studentId] = { 
      role: (Math.random() <0.5 ? 'French' : 'English'),
      group: '0'
    }
  })
  return {
  	product: [],
  	socialStructure: socStruc
  }
}

export default { id: 'op-jigsaw', operator: operator, config: config, meta: meta }
