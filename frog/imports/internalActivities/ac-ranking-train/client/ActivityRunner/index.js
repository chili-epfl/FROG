import * as React from 'react';
import styled from 'styled-components';
import { HTML } from '/imports/frog-utils';
import { isEqual } from 'lodash';
import { Grid } from '@material-ui/core';

import Dashboard from '../../Dashboards';

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
  <>
    <h1>Activity completed!</h1>
    <div style={{ width: '100%' }}>
      <button
        type="button"
        style={{ ...styles.button }}
        onClick={() => dataFn.objInsert(false, ['completed'])}
      >
        Back to activity
      </button>
    </div>
  </>
);

const ActivityRunner = props => {
  const {
    activityData: { config },
    logger,
    dataFn,
    userInfo,
    data
  } = props;

  const [init, setInit] = React.useState(false);
  const { round, answers } = data;

  if (!init && !answers[0][userInfo.id]) {
    dataFn.objInsert({}, ['answers', 0, userInfo.id]);
    dataFn.objInsert({}, ['answers', 1, userInfo.id]);
    dataFn.objInsert(userInfo.name, ['group', userInfo.id]);
    setInit(true);
  }

  const listStyles = {
    list: {
      width: nKey(answers) === 0 ? '100%' : 100 / nKey(answers) + '%',
      verticalAlign: 'top'
    }
  };

  const done =
    answers[round][userInfo.id] &&
    nKey(answers[round][userInfo.id]) === nKey(config.answers);

  const checkAnswers = () => {
    const users = Object.keys(answers[round]);
    return !users
      .map(user => isEqual(answers[round][userInfo.id], answers[round][user]))
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
    if (round === 0) {
      if (done && checkAnswers()) {
        dataFn.objInsert(false, ['alert']);
        dataFn.objInsert(1, ['round']);
        logger([{ type: 'progress', value: 0.5 }]);
      } else {
        dataFn.objInsert(true, ['alert']);
      }
    } else if (done && checkAnswers()) {
      dataFn.objInsert(false, ['alert']);
      dataFn.objInsert(true, ['completed']);
      logger([{ type: 'progress', value: 1 }]);
    } else {
      dataFn.objInsert(true, ['alert']);
    }
  };

  return (
    <>
      <Grid style={{ height: '100%' }} container spacing={24}>
        {round === 1 && !data.completed && (
          <Grid style={{ height: '100%' }} item xs={6}>
            <Dashboard
              dashboard={props.activityData.config.dashboard}
              state={props.activityData?.data?.logs}
            />
          </Grid>
        )}
        <Grid item xs={round === 1 && !data.completed ? 6 : 12}>
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
                            {Object.keys(answers[round]).map(member => (
                              <th key={member} style={{ ...listStyles.list }}>
                                <p style={{ fontWeight: 'normal' }}>
                                  {data.group[member] + "'s List"}
                                </p>
                                <AnswerList
                                  {...props}
                                  answers={answers[round][member]}
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
                  {nKey(answers[round][userInfo.id] || {}) <
                    config.answers.length && (
                    <>
                      <hr style={{ height: '5px' }} />
                      <div>
                        <div style={{ width: '100%' }}>
                          <p>
                            At rank{' '}
                            {nKey(answers[round][userInfo.id] || {}) + 1}, add
                            item:
                          </p>
                          <div
                            style={{
                              position: 'relative',
                              width: '100%',
                              display: 'block'
                            }}
                          >
                            {(config.answers || [])
                              .filter(
                                ans => !(answers[round][userInfo.id] || {})[ans]
                              )
                              .map(ans => (
                                <AddAnswer
                                  {...props}
                                  title={ans}
                                  rank={nKey(answers[round][userInfo.id] || {})}
                                  key={ans}
                                />
                              ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <hr style={{ height: '5px' }} />
                  <div>
                    {data.alert ? (
                      <p style={{ color: 'red' }}>{alertMessage()}</p>
                    ) : null}
                    <button
                      type="button"
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
        </Grid>
      </Grid>
    </>
  );
};

export default ActivityRunner;
