// @flow

import React from 'react';
import styled from 'styled-components';

import { TextInput } from '../TextInput'

const Main = styled.div`
  display: flex;
  flex-direction: row;
  height: 80%;
  width: 100%;
  position: absolute;
  justify-content: space-evenly;
`

const Column = styled.div`
  width: 200px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`

const Node = ({ id, onChange, data }) =>
  <TextInput
    onChange={(value) => { if(onChange) { onChange(id,value) }}}
    value={data && data[id]}
  />

export default ({ onChange, data }: Object) =>
  <Main>
    <Column>
      {['a1'].map(id => <Node {...{onChange, data, id}} key={id}/>)}
    </Column>
    <Column>
      {['b0', 'b1', 'b2'].map(id => <Node {...{onChange, data, id}} key={id}/>)}
    </Column>
    <Column>
      {['c0', 'c1', 'c2', 'c3', 'c4', 'c5'].map(id => <Node {...{onChange, data, id}} key={id}/>)}
    </Column>
  </Main>
