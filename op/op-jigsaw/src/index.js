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

export const operator = (config, object) => {
  console.log('operator')
  console.log(object)
  const { products, socialStructures, globalStructure } = object

  const socStruc = globalStructure.studentIds.map(studentId => { return (
  	{ studentId, attributes: { role: (Math.random() <0.5 ? 'French' : 'English'), group: 0 } }
  )})
  return {
  	product: [],
  	socialStructure: socStruc
  }
}

export default { id: 'op-jigsaw', operator: operator, config: config, meta: meta }
