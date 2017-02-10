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

export const operator = (products, socialStructure, globalStructure) => {
  
  const socStruc = globalStructure['studentIds'].map(studentId => { return (
  	{ studentId, attributes: { role: 'President', group: 0 } }
  )})
  return {
  	product: [],
  	socialStructure: socStruc
  }
}

export default { id: 'op-jigsaw', operator: operator, config: config, meta: meta }
