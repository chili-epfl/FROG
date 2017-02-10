import React from 'react'

export const meta = {
  name: 'HTML text component',
  type: 'react-component'
}

export const config = {
  title: 'Configuration for text component',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'Activity name'
    },
    duration: {
      type: 'number',
      title: 'Duration in seconds (0 for infinity)'
    },
    title: {
      type: 'string',
      title: 'Title'
    },
    roles: {
      type: 'string',
      title: 'Roles (separated by comma)'
    },
    text: {
      type: 'string',
      title: 'Text (separated by comma)'
    }
  }
}

export const ActivityRunner = ({ config, object, userId }) => {

  if(object) { 
    const { products, socialStructures, globalStructure } = object
    const roles = config.roles.split(',')
    const texts = config.text.split(',')
    const matching = {}
    roles.forEach((role, index) => matching[role] = texts[index])

    const socialRoles = {}
    socialStructures[0].forEach(att => {
      socialRoles[att.studentId] = att.attributes.role
    })

    return (
      <div> 
        <h1>{config.title}</h1>
        <p>Your role is {socialRoles[userId]}</p>
        <p>{matching[socialRoles[userId]]}</p>
      </div>
    )
  }
  return <p>NULL OBJECT</p>
}

export default { id: 'ac-jigsaw', ActivityRunner: ActivityRunner, config: config, meta: meta }
