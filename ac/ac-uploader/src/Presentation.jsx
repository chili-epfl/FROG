// @flow

import React from 'react';
import styled from 'styled-components';

export default ({ activityData }: Object) =>
  <Main>
    <h2 style={{ textAlign: 'center' }}>
      {activityData.config.title}
    </h2>
    <div style={{ textAlign: 'center' }}>
      {activityData.config.topic}
    </div>
  </Main>;

const Main = styled.div`
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
