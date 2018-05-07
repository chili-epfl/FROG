// @flow

import * as React from 'react';
import styled from 'styled-components';
import { HTML } from 'frog-utils';
import { isEqual } from 'lodash';

import type { ActivityRunnerPropsT } from 'frog-utils';
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

const ActivityRunner = (props: ActivityRunnerPropsT) => {
  const {
    activityData: { config },
    logger,
    dataFn,
    userInfo,
    data
  } = props;
  const { answers, justification } = data;

  if (!answers[userInfo.id]) {
    dataFn.objInsert({}, ['answers', userInfo.id]);
    dataFn.objInsert(userInfo.name, ['group', userInfo.id]);
  }

  const listStyles = {
    list: {
      width: nKey(answers) === 0 ? '100%' : 100 / nKey(answers) + '%',
      verticalAlign: 'top'
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

  const alertMessage = () => {
    if (!done) {
      return 'Please complete all of the steps in the activity before submitting.';
    } else if (!checkAnswers()) {
      return 'Please make sure all members of the group have the same ranking before submitting.';
    } else {
      return null;
    }
  };

  const onSubmit = () => {
    if (done && checkAnswers()) {
      dataFn.objInsert(false, ['alert']);
      dataFn.objInsert(true, ['completed']);
      logger([{ type: 'progress', value: 1 }]);
    } else {
      dataFn.objInsert(true, ['alert']);
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
              <HTML html={config.guidelines} />
            </div>
            <hr style={{ height: '5px' }} />
            <div>
              <HTML html={config.title} />
            </div>
            <div style={{ width: '100%' }}>
              <div>
                <table style={{ width: '100%' }}>
                  <tbody>
                    <tr>
                      {Object.keys(answers).map(member => (
                        <th key={member} style={{ ...listStyles.list }}>
                          <p style={{ fontWeight: 'normal' }}>
                            {data.group[member] + "'s List"}
                          </p>
                          <AnswerList
                            {...props}
                            answers={answers[member]}
                            userID={member}
                            uiID={userInfo.id}
                          />
                        </th>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {nKey(answers[userInfo.id] || {}) < config.answers.length && (
              <React.Fragment>
                <hr style={{ height: '5px' }} />
                <div>
                  <div style={{ width: '100%' }}>
                    <p>
                      At rank {nKey(answers[userInfo.id] || {}) + 1}, add item:
                    </p>
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
              </React.Fragment>
            )}
            <hr style={{ height: '5px' }} />
            {config.justify && <Justification {...props} key="justification" />}
            <div>
              {data.alert ? (
                <p style={{ color: 'red' }}>{alertMessage()}</p>
              ) : null}
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
