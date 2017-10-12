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
  height: 90%;
  display: flex;
  flex-direction: row;
`;

export default ({ activityData }: ActivityRunnerT) => (
  <Main>
    <h1>{activityData.config.title}</h1>
    <Container>
      <Images style={{ width: '50%' }} {...activityData.config} />
      <div
        style={{
          width: '2px',
          height: '100%',
          background: '#000000'
        }}
      />
      <Rules
        style={{ width: '50%', marginLeft: '10px' }}
        generateNewPics={e => {
          e.preventDefault();
        }}
        {...activityData.config}
      />
    </Container>
  </Main>
);
