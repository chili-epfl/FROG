import React from 'react'
import styled from 'styled-components'
import { connect } from './store'
import Activities from '../Activities'

export default connect(({ store: { hasSelection, objects } }) => {
  if (!hasSelection) { return null }
  const [type, item] = hasSelection
  if(type !== 'activity') { return(<h1>Not implemented for this item type yet</h1>) }
  return(
    <div>
      <h1>{item.title}</h1>
          <Activities />
    </div>
  )
})
