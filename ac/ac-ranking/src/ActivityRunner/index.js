// @flow

import * as React from 'react';
import styled from 'styled-components';
import { HTML } from 'frog-utils';
import { isEqual } from 'lodash';

import type { ActivityRunnerT } from 'frog-utils';
import Justification from './Justification';

import AnswerList from './AnswerList';
import AddAnswer from './AddAnswer';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100%;
`;

const ListContainer = styled.div`
  padding: 2%;
  width: 100%;
`;

const blue = '#337ab7';
const grey = '#d3d3d3';

const nKey = x => Object.keys(x).length;

const styles = {
  button: {
    width: 'auto',
    margin: '10px',
    marginRight: '20px',
    position: 'relative',
    whiteSpace: 'normal',
    float: 'center',
    display: 'inline-block',
    backgroundColor: blue,
    color: '#FFF'
  }
};

const Completed = ({ dataFn }) => (
  <React.Fragment>
    <h1>Activity completed!</h1>
    <div style={{ width: '100%' }}>
      <button
        style={{ ...styles.button }}
        onClick={() => dataFn.objInsert(false, ['completed'])}
      >
        Back to activity
      </button>
    </div>
  </React.Fragment>
);

const ActivityRunner = (props: ActivityRunnerT) => {
  const { activityData: { config }, logger, dataFn, userInfo, data } = props;
  const { answers, justification } = data;

  if (!answers[userInfo.id]) {
    dataFn.objInsert({}, ['answers', userInfo.id]);
    dataFn.objInsert(userInfo.name, ['group', userInfo.id]);
  }

  const listStyles = {
    list: {
      width: nKey(answers) === 0 ? '100%' : 100 / nKey(answers) + '%',
      position: 'relative',
      whiteSpace: 'normal',
      float: 'center',
      display: 'inline-block'
    }
  };

  const done =
    answers[userInfo.id] &&
    nKey(answers[userInfo.id]) === nKey(config.answers) &&
    (!config.mustJustify || justification.length > 0);

  const checkAnswers = () => {
    const users = Object.keys(answers);
    return !users
      .map(user => isEqual(answers[userInfo.id], answers[user]))
      .includes(false);
  };

  const onSubmit = () => {
    if (done && checkAnswers()) {
      dataFn.objInsert(true, ['completed']);
      logger([{ type: 'progress', value: 1 }]);
    }
  };

  return (
    <div className="bootstrap">
      <Container>
        {data.completed ? (
          <Completed {...props} />
        ) : (
          <ListContainer>
            <div>
              <HTML html={config.title} />
            </div>
            <p>{config.guidelines}</p>
            <div style={{ width: '100%' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  display: 'block'
                }}
              >
                {Object.keys(answers).map(member => (
                  <div key={member} style={{ ...listStyles.list }}>
                    <p>{data.group[member] + "'s List"}</p>
                    <AnswerList
                      {...props}
                      answers={answers[member]}
                      userID={member}
                      uiID={userInfo.id}
                    />
                  </div>
                ))}
              </div>
            </div>

            <hr style={{ height: '5px' }} />
            <div>
              <div style={{ width: '100%' }}>
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    display: 'block'
                  }}
                >
                  {(config.answers || [])
                    .filter(ans => !(answers[userInfo.id] || {})[ans])
                    .map(ans => (
                      <AddAnswer
                        {...props}
                        title={ans}
                        rank={nKey(answers[userInfo.id] || {})}
                        key={ans}
                      />
                    ))}
                </div>
              </div>
            </div>
            <hr style={{ height: '5px' }} />
            {config.justify && <Justification {...props} key="justification" />}
            <div>
              <button
                onClick={onSubmit}
                key="submit"
                style={{
                  ...styles.button,
                  backgroundColor: !done || !checkAnswers() ? grey : blue,
                  marginLeft: '0px'
                }}
              >
                Submit
              </button>
            </div>
          </ListContainer>
        )}
      </Container>
    </div>
  );
};



export default ActivityRunner;
