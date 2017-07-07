// @flow

import React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import styled from 'styled-components';

import Images from './Images';
import Rules from './Rules';


const Main = styled.div`
  width: 100%;
  height: 100%;
`;

const Container = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: row
`;

export default ({ activityData }: ActivityRunnerT) =>
  <Main>
    <h1>{activityData.config.title}</h1>
    <Container>
      <Images style={{ width: '50%' }} {...activityData.config} />
      <Rules
        style={{ width: '50%' }}
        generateNewPics={e => {
          e.preventDefault();
        }}
        {...activityData.config}
      />
    </Container>
  </Main>;
