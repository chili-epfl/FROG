// @flow

import React from 'react';
import styled from 'styled-components';

const Main = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  height: 50%;
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const Img = ({ url }) =>
  <img
    style={{
      margin: '1%',
      width: '90%',
      height: '98%'
    }}
    src={url}
    alt={''}
  />;

const Rectangle = ({ color }) =>
  <div
    style={{
      width: '6%',
      height: '98%',
      margin: '1%',
      background: color
    }}
  />;

const Images = (props: {
  imgTrue: String,
  imgFalse: String,
  style: Object
}) => {
  if (!props.imgTrue || !props.imgFalse) {
    return <div>{"Images's URI not found"}</div>;
  } else {
    return (
      <Main style={props.style}>
        <Container>
          <Rectangle color={'#00ff00'} />
          <Img url={props.imgTrue} />
        </Container>
        <Container>
          <Rectangle color={'#ff0000'} />
          <Img url={props.imgFalse} />
        </Container>
      </Main>
    );
  }
};

export default Images;
