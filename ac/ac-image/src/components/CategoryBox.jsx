// @flow

import React from 'react';
import styled from 'styled-components';

import CenteredImg from './CenteredImg';

const CategoryContainer = styled.button`
  position: relative;
  border: solid 2px #a0a0a0;
  background: none;
  max-width: 250px;
  height: 250px;
  width: 100%;
  margin: 5px;
  padding: 0px;
  flex: 0 1 auto;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
`;

const ImgContainer = styled.div`
  position: relative;
  min-width: 80px;
  min-height: 80px;
  margin: 5px;
  flex: 1 1 auto;
`;

const CategoryName = styled.span`
  position: absolute;
  height: 10%;
  bottom: 0px;
`;

const CategoryBox = ({
  images,
  category,
  setCategory
}: {
  images: any[],
  category: string,
  setCategory: Function
}) => (
  <CategoryContainer onClick={() => setCategory(category)}>
    {images.slice(0, 4).map((image, i) => (
      <ImgContainer key={image + i.toString()}>
        <CenteredImg url={image} />
      </ImgContainer>
    ))}
    <CategoryName>{category}</CategoryName>
  </CategoryContainer>
);

CategoryBox.displayName = 'CategoryBox';
export default CategoryBox;
