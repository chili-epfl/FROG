// @flow

import React from 'react';
import styled from 'styled-components';

import ImagePanel from './ImagePanel';

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
  height: 100%;
  width: 100px;
  flex: 0 1 auto;
  border: none;
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

export default ({ images, setImageKey, imageKey }: Object) =>
  <Scroll>
    <Main style={{ width: 100 * images.length + 'px' }}>
      {images.map(image =>
        <Box
          key={image.key}
          onClick={() => setImageKey(image.key)}
          style={{ background: imageKey === image.key ? 'lightblue' : 'none' }}
        >
          <ImagePanel url={image.thumbnail} />
          <Category>
            {image.category}
          </Category>
        </Box>
      )}
    </Main>
  </Scroll>;
