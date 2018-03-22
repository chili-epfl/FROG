// @flow

import * as React from 'react';
import styled from 'styled-components';
import { type ActivityRunnerT, HTML } from 'frog-utils';

import Quiz from './Quiz';

const Main = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fdfdfd;
`;

const Container = styled.div`
  max-width: 500px;
  max-height: 100%;
  margin: 10px;
  flex: 0 1 auto;
`;

const Completed = ({ dataFn }) => (
  <React.Fragment>
    <h1>Quiz completed!</h1>
    <button onClick={() => dataFn.objInsert(false, ['completed'])}>
      Back to quiz
    </button>
  </React.Fragment>
);

export default (props: ActivityRunnerT) => {
  const { activityData, data } = props;
  const { config } = activityData;
  return (
    <Main>
      <h1>{config.title || 'Quiz'}</h1>
      <Container>
        <HTML html={config.guidelines || 'Answer the following questions'} />
      </Container>
      <Container>
        {data.completed ? <Completed {...props} /> : <Quiz {...props} />}
      </Container>
    </Main>
  );
};
