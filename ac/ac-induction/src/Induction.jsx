// @flow

import React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import styled from 'styled-components';

import Images from './Images';
import Rules from './Rules';

const Main = styled.div`
  width: 100%;
  height: 100%;
  display: inline-block;
`

const Container = styled.div`
  width: 50%;
  height: 80%;
`

export default ({ activityData }: ActivityRunnerT) =>
  <Main>
    <h1>{activityData.config.title}</h1>
    <Container>
      <Images {...activityData.config} />
    </Container>
    <Container>
      <Rules
        generateNewPics={e => { e.preventDefault(); }}
        {...activityData.config}
      />
    </Container>
  </Main>;
