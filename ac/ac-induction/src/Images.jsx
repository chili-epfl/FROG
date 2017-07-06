// @flow

import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 45%;
  width: 100%;
  display: inline-block;
`

const Img = ({ url }) => <img
  style={{
    width: '50px',
    height: '95%'
  }}
  src={url}
  alt={''}
/>

const Rectangle = ({ color }) => <div
  style={{
    width: '50%',
    height: '100%',
    background: color
  }}
/>

const Images = (props: { imgTrue: String, imgFalse: String }) => {
  if (!props.imgTrue || !props.imgFalse) {
    return <div>{"Images's URI not found"}</div>;
  } else {
    return (
      <div>
        <Container>
          <Rectangle color={'#00ff00'} />
          <Img url={props.imgTrue} />
        </Container>
        <Container>
          <Rectangle color={'#ff0000'} />
          <Img url={props.imgFalse} />
        </Container>
      </div>
    );
  }
};

export default Images;
