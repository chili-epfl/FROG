// @flow

import React from 'react';
import styled from 'styled-components';

import { TableView, TreeView, toTableData } from 'frog-utils';

import { getType } from '../Classifier';

const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  flex: 0 1 auto;
`;

const ImgPanel = styled.img`
  max-width: 80%;
  max-height: 80%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export default ({ obj, small }: { obj: Object, small: boolean }) =>
  <Container>
    { getType(obj) == 'image' && !small && <ImgPanel src={obj.url} /> }
    { getType(obj) == 'image' && small && <ImgPanel src={obj.thumbnail} /> }
    { getType(obj) == 'table' && !small && <TableView initialData={toTableData(obj.data, 10, 5)} /> }
    { getType(obj) == 'table' && small && <span>TABLE</span> }
    { getType(obj) == 'tree' && !small && <TreeView /> }
    { getType(obj) == 'tree' && small && <span>TREE</span> }
  </Container>;
