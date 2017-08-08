// @flow

import React, { Component } from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import { shuffle } from 'lodash';
import styled from 'styled-components';

// import Images from './Images';
// remove, deal with image directly
import DecisionPanel from './DecisionPanel';
// => change name to decision panel

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

class InducWindow extends Component {
  state: { index: number};
  allExemples: Array<Object>;

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
    this.allExemples = shuffle(props.activityData.config.examples);
  }

  next = (choosen, goodJustif) => {
    const tmp = this.allExemples[this.state.index].isCorrect;
    if(goodJustif && ((tmp === undefined && !choosen) || choosen === tmp)){
      console.log('Right answer !!!');
    }else console.log('Sorry, error');
    if(this.state.index < this.allExemples.length - 1 && this.state.index < this.props.activityData.config.nMaxExamples - 1)
      this.setState({index: this.state.index + 1})
    }

  render() {
    return (
      <Main>
        <h1>
          {this.props.activityData.config.title}
        </h1>
        <Container>
          <img
            style={{ maxWidth: '50%', maxHeight: '100%', margin: 'auto' }}
            src={this.allExemples[this.state.index].image}
            alt={''}
          />
          <div style={{ width: '2px', height: '100%', background: 'black' }} />
          <DecisionPanel
            style={{ width: '50%', marginLeft: '10px' }}
            nextFun={this.next}
            {...this.props.activityData.config}
          />
        </Container>
      </Main>
    );
  }
}

export default InducWindow;
