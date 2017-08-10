// @flow

import React, { Component } from 'react';
import { shuffle } from 'lodash';
import styled from 'styled-components';
import type { ActivityRunnerT } from 'frog-utils';


import DecisionPanel from './DecisionPanel';
import ImgBis from './ImgBis';

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

export default ({ activityData, data, dataFn }: ActivityRunnerT) => {
  console.log(data);

  const currentEx = activityData.config.examples[data.listIndex[data.index]];
  const nExShortCut = activityData.config.nExamples;

  const next = (choosen: boolean, goodJustif: boolean) => {
    const incorrect =
      currentEx.isIncorrect === undefined
        ? false
        : currentEx.isIncorrect;

    const answer = {wasCorrect: !incorrect, wellJustified: goodJustif};
    if (incorrect === choosen) answer.reconnized = false;
    else answer.reconnized = true;

    dataFn.objInsert(answer, data.index);
    dataFn.objInsert(data.index + 1, 'index');

    const tmp = activityData.config.examples[data.listIndex[data.index]];

    if(tmp !== undefined){
      const genDefs = activityData.config.trueDef.concat(activityData.config.falseDef);
      if(tmp.whyIncorrect !== undefined) genDefs.push(tmp.whyIncorrect);
      dataFn.objInsert(shuffle(genDefs), 'currentDefs');
      dataFn.objInsert(genDefs.map(x => false), 'currentValueState');
      dataFn.objInsert(true, 'currentSelected');
    }
  };

  return (
    <Main>
      <h1>
        {activityData.config.title}
      </h1>
      {(currentEx !== undefined) &&
        <Container>
          <img
            style={{ maxWidth: '50%', maxHeight: '100%', margin: 'auto' }}
            src={currentEx.image}
            alt={''}
          />
          <div
            style={{ width: '2px', height: '100%', background: 'black' }}
          />
          <DecisionPanel
            style={{ width: '50%', marginLeft: '10px' }}
            nextFun={next}
            activityData={activityData}
            data={data}
            dataFn={dataFn}
          />
        </Container>}

        {(currentEx === undefined) &&
          <div style={{ height: '100%', width: '100%' }}>
            <div
              style={{
                height: nExShortCut + 100 + 'px',
                display: 'flex',
                flexDirection: 'row'
              }}
            >
              <div style={{ width: '50%' }}>
                <h4 style={{ paddingLeft: '5%' }}>
                  Example(s) that respected the definition:
                </h4>
                <ExamplesCont
                  style={{ height: nExShortCut + 'px' }}
                >
                  {data.listIndex.map(x => {
                    activityData.config.examples[x]
                  }).filter(x => !x.isIncorrect)
                  .map(x =>
                    <ImgBis
                      url={x.image}
                      w={nExShortCut}
                      key={Math.random()}
                    />
                  )}
                </ExamplesCont>
              </div>
              <div style={{ width: '50%' }}>
                <h4 style={{ paddingLeft: '5%' }}>
                  Example(s) that didn't respect the definition:
                </h4>
                <ExamplesCont
                  style={{ height: nExShortCut + 'px' }}
                >
                  {data.listIndex.map(x => {
                    activityData.config.examples[x]
                  }).filter(x => x.isIncorrect)
                  .map(x =>
                    <ImgBis
                      url={x.image}
                      w={nExShortCut}
                      key={Math.random()}
                    />
                  )}
                </ExamplesCont>
              </div>
            </div>
            <h4> Definition of the concept: </h4>
            <div className="well" style={{ width: '90%', marginLeft: '1%' }}>
              {activityData.config.definition}
            </div>
          </div>}
    </Main>
  );
}
