// @flow

import React from 'react';
import styled from 'styled-components';
import { type LogT } from 'frog-utils';

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

const CategoryName = styled.span`
  height: 10%;
  font-size: 3em;
  bottom: 0px;
`;

const CategoryBox = ({
  category,
  setCategory,
  logger
}: {
  category: string,
  setCategory: Function,
  logger: LogT => void
}) => (
  <CategoryContainer
    onClick={() => {
      logger({ type: 'category.enter', value: category });
      setCategory(category);
    }}
  >
    <CategoryName>{category}</CategoryName>
  </CategoryContainer>
);

CategoryBox.displayName = 'CategoryBox';
export default CategoryBox;
