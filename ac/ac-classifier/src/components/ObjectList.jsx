// @flow

import React from 'react';
import styled from 'styled-components';

const Scroll = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
  width: 100%;
  height: 100px;
  border-top: solid 2px;
`;

const Main = styled.div`
  display: block;
  height: 100%;
`;

const Box = styled.button`
  position: relative;
  width: 150px;
  vertical-align: top;
  flex: 0 1 auto;
  border: none;
  overflow: hidden;
`;

const Category = styled.span`
  position: absolute;
  top: 10%;
  left: 0;
  width: 100%;
  text-align: center;
  vertical-align: middle;
  font-size: x-large;
  font-weight: bold;
`;

const Star = () => (
  <div className="bootstrap">
    <span
      className="glyphicon glyphicon-star"
      style={{
        right: 0,
        color: 'gold',
        fontSize: 'x-large',
        position: 'absolute'
      }}
    />
  </div>
);
Star.displayName = 'Star';

export default ({
  objects,
  setDataFn,
  setObjectKey,
  objectKey,
  LearningItem
}: Object) => {
  return (
    <Scroll>
      <Main style={{ width: 150 * objects.length + 'px' }}>
        {objects.map(obj => (
          <LearningItem
            type="viewThumb"
            key={obj}
            id={obj}
            render={props => (
              <Box
                key={obj}
                onClick={() => {
                  setObjectKey(obj);
                  setDataFn(props.dataFn);
                }}
                style={{
                  background: objectKey === obj ? 'lightblue' : 'none'
                }}
              >
                {props.children}
                <Category>{props.meta.category}</Category>
                {props.meta.selected && <Star />}
              </Box>
            )}
          />
        ))}
      </Main>
    </Scroll>
  );
};
