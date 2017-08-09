// @flow

import React, { Component } from 'react';
import { shuffle } from 'lodash';
import styled from 'styled-components';

import DecisionPanel from './DecisionPanel';

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

const ExamplesCont = styled.div`
  border: 2px solid #ecf0f1;
  width: 95%;
  margin: auto;
  display: flex;
  flex-direction: row;
`;

const Img = styled.img`
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ImgBis = (props: { url: string, correct: boolean, w: number }) =>
  props.correct
    ? <div
        style={{
          border: '5px solid #00FF00',
          width: props.w + 'px',
          height: '100%',
          position: 'relative'
        }}
      >
        <Img src={props.url} alt="" />
      </div>
    : <div
        style={{
          border: '5px solid #FF0000',
          width: props.w + 'px',
          height: '100%',
          position: 'relative'
        }}
      >
        <Img src={props.url} alt="" />
      </div>;

class InducWindow extends Component {
  state: { index: number, done: boolean };
  allExemples: Array<Object>;

  constructor(props: {
    activityData: {
      config: {
        title: string,
        trueDef: Object,
        falseDef: Object,
        examples: Array<any>,
        nMaxExamples: number,
        definition: string
      }
    }
  }) {
    super(props);

    this.allExemples = shuffle(props.activityData.config.examples);
    // deal with the case nMax > number of examples
    for (
      let i = 0;
      i <
      Math.floor(
        props.activityData.config.nMaxExamples /
          props.activityData.config.examples.length
      );
      i += 1
    ) {
      this.allExemples = this.allExemples.concat(
        shuffle(props.activityData.config.examples).map(x => ({
          image: x.image,
          isIncorrect: x.isIncorrect,
          whyIncorrect: x.whyIncorrect
        }))
      );
    }
    this.allExemples = this.allExemples.slice(
      0,
      props.activityData.config.nMaxExamples
    );

    this.state = {
      index: 0,
      done: false
    };
  }

  next = (choosen: boolean, goodJustif: boolean) => {
    const incorrect =
      this.allExemples[this.state.index].isIncorrect === undefined
        ? false
        : this.allExemples[this.state.index].isIncorrect;
    if (incorrect === choosen) {
      this.allExemples[this.state.index].ansCorr = false;
    } else if (!goodJustif) {
      this.allExemples[this.state.index].ansCorr = false;
    } else {
      this.allExemples[this.state.index].ansCorr = true;
    }

    if (this.state.index < this.props.activityData.config.nMaxExamples - 1) {
      this.setState({ index: this.state.index + 1 });
    } else {
      this.setState({ done: true });
    }
  };

  render() {
    return (
      <Main>
        <h1>
          {this.props.activityData.config.title}
        </h1>
        {!this.state.done &&
          <Container>
            <img
              style={{ maxWidth: '50%', maxHeight: '100%', margin: 'auto' }}
              src={this.allExemples[this.state.index].image}
              alt={''}
            />
            <div
              style={{ width: '2px', height: '100%', background: 'black' }}
            />
            <DecisionPanel
              style={{ width: '50%', marginLeft: '10px' }}
              nextFun={this.next}
              trueDef={this.props.activityData.config.trueDef}
              falseDef={this.props.activityData.config.falseDef}
              whyIncorrect={this.allExemples[this.state.index].whyIncorrect}
            />
          </Container>}
        {this.state.done &&
          <div style={{ height: '100%', width: '100%' }}>
            <div
              style={{
                height: 850 / this.allExemples.length + 100 + 'px',
                display: 'flex',
                flexDirection: 'row'
              }}
            >
              <div style={{ width: '50%' }}>
                <h4 style={{ paddingLeft: '5%' }}>
                  {' '}Example(s) that respected the definition:{' '}
                </h4>
                <ExamplesCont
                  style={{ height: 850 / this.allExemples.length + 'px' }}
                >
                  {this.allExemples
                    .filter(x => !x.isIncorrect)
                    .map(x =>
                      <ImgBis
                        url={x.image}
                        correct={x.ansCorr}
                        w={850 / this.allExemples.length}
                        key={Math.random()}
                      />
                    )}
                </ExamplesCont>
              </div>
              <div style={{ width: '50%' }}>
                <h4 style={{ paddingLeft: '5%' }}>
                  {"Example(s) that didn't respect the definition:"}
                </h4>
                <ExamplesCont
                  style={{ height: 850 / this.allExemples.length + 'px' }}
                >
                  {this.allExemples
                    .filter(x => x.isIncorrect)
                    .map(x =>
                      <ImgBis
                        url={x.image}
                        correct={x.ansCorr}
                        w={850 / this.allExemples.length}
                        key={Math.random()}
                      />
                    )}
                </ExamplesCont>
              </div>
            </div>
            <h4> Definition of the concept: </h4>
            <div className="well" style={{ width: '90%', marginLeft: '1%' }}>
              {this.props.activityData.config.definition}
            </div>
          </div>}
      </Main>
    );
  }
}

export default InducWindow;
