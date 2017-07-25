// @flow

import React from 'react';
import styled from 'styled-components';

const Main = styled.div`
  height: 800px;
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
      margin: 'auto',
      maxWidth: '100%',
      maxHeight: '90%'
    }}
    src={url}
    alt={''}
  />;

const Rectangle = ({ color }) =>
  <div
    style={{
      width: '40px',
      height: '90%',
      marginTop: '2%',
      marginLeft: '1%',
      background: color
    }}
  />;

const Images = (props: {
  imgTrue: String,
  imgFalse: String,
  style: Object
}) => {
  if (!props.imgTrue || !props.imgFalse) {
    return (
      <div>
        {"Images's URI not found"}
      </div>
    );
  } else {
    return (
      <Main style={props.style}>
        <Container>
          <Rectangle color={'#00ff00'} />
          <Img url={props.imgTrue} />
        </Container>
        <div
          style={{
            width: '100%',
            height: '2px',
            background: '#000000'
          }}
        />
        <Container>
          <Rectangle color={'#ff0000'} />
          <Img url={props.imgFalse} />
        </Container>
      </Main>
    );
  }
};

export default Images;
