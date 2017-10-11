// @flow

import React from 'react';
// import { shuffle } from 'lodash';
import { stringToArray } from '../ArrayFun';

export default (props: Object) => {
  const { data } = props;
  const choice = data.testChoice;
  // console.log(data);
  return (
    <div style={{ width: '100%', height: '80%' }}>
      {choice ? <TruePanel {...props} /> : <FalsePanel {...props} />}
    </div>
  );
};

const TruePanel = ({
  title,
  indexTest,
  properties,
  examples,
  dataFn,
  data
}: Object) => {
  const propertiesTest = stringToArray(examples[indexTest].respectedProperties);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h4>
        {"Select properties that makes him an example of the concept '" +
          title +
          "'"}
      </h4>
      <div
        style={{
          width: '100%',
          height: 'fit-content',
          textAlign: 'left',
          paddingLeft: '100px'
        }}
      >
        {propertiesTest.map(x =>
          <div className="checkbox" key={x}>
            <input
              type="checkbox"
              value=""
              onClick={() => {
                const tmpSelected = data.tmpSelected.includes(x)
                  ? data.tmpSelected.filter(y => y !== x)
                  : [...data.tmpSelected, x];
                dataFn.objInsert(tmpSelected, 'tmpSelected');
                // data.tmpSelected.includes(x)
                //   ? (data.tmpSelected =
                //   : data.tmpSelected.push(x);
              }}
            />
            {properties[x]}
          </div>
        )}
      </div>
    </div>
  );
};

const FalsePanel = ({
  title,
  indexTest,
  properties,
  examples,
  dataFn,
  data
}: Object) =>
  indexTest % 2 === 0
    ? <div style={{ width: '100%', height: '100%' }}>
        <h4>
          {"Select properties that exclude him of being an example of the concept '" +
            title +
            "'"}
        </h4>
        <div
          style={{
            width: '100%',
            height: 'fit-content',
            textAlign: 'left',
            paddingLeft: '100px'
          }}
        >
          {stringToArray(examples[indexTest].respectedProperties).map(x =>
            <div className="checkbox" key={x}>
              <input
                type="checkbox"
                value=""
                onClick={() => {
                  const tmpSelected = data.tmpSelected.includes(x)
                    ? data.tmpSelected.filter(y => y !== x)
                    : [...data.tmpSelected, x];
                  dataFn.objInsert(tmpSelected, 'tmpSelected');
                }}
              />
              {properties[x]}
            </div>
          )}
        </div>
      </div>
    : <div>
        <h4>
          {"Select what would be missing to be an example of the concept '" +
            title +
            "'"}
        </h4>
        <div
          style={{
            width: '100%',
            height: 'fit-content',
            textAlign: 'left',
            paddingLeft: '100px'
          }}
        >
          {stringToArray(examples[indexTest].respectedProperties).map(x =>
            <div className="checkbox" key={x}>
              <input
                type="checkbox"
                value=""
                onClick={() => {
                  const tmpSelected = data.tmpSelected.includes(x)
                    ? data.tmpSelected.filter(y => y !== x)
                    : [...data.tmpSelected, x];
                  dataFn.objInsert(tmpSelected, 'tmpSelected');
                }}
              />
              {properties[x]}
            </div>
          )}
        </div>
      </div>;
