// @flow

import React from 'react';
import styled from 'styled-components';

import ObjectPanel from './ObjectPanel';
import { getType } from '../Classifier';

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

<<<<<<< HEAD:ac/ac-imgClass/src/components/ImageList.jsx
export default ({ images, setImageKey, imageKey }: Object) => (
  <Scroll>
    <Main style={{ width: 100 * images.length + 'px' }}>
      {images.map(image => (
=======
export default ({ objects, setObjectKey, objectKey }: Object) =>
  <Scroll>
    <Main style={{ width: 100 * objects.length + 'px' }}>
      {objects.map(obj =>
>>>>>>> unilMontyComponent:ac/ac-imgClass/src/components/ObjectList.jsx
        <Box
          key={obj.key}
          onClick={() => setObjectKey(obj.key)}
          style={{ background: objectKey === obj.key ? 'lightblue' : 'none' }}
        >
<<<<<<< HEAD:ac/ac-imgClass/src/components/ImageList.jsx
          <ImagePanel url={image.thumbnail} />
          <Category>{image.category}</Category>
=======
          <ObjectPanel obj={obj} small={true}/>
          <Category>
            {obj.category}
          </Category>
>>>>>>> unilMontyComponent:ac/ac-imgClass/src/components/ObjectList.jsx
        </Box>
      ))}
    </Main>
  </Scroll>
);
