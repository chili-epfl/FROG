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

const TextView = ({ data }) => (
  <span style={{ fontSize: '36px' }}>{data.text}</span>
);

const components = {
  image: {
    small: ({ obj }) => <ImgPanel src={obj.thumbnail || obj.url} />,
    full: ({ obj }) => <ImgPanel src={obj.url} />
  },
  table: {
    full: ({ obj }) => <TableView initialData={toTableData(obj.data, 10, 5)} />
  },
  tree: {
    full: ({ obj }) => <TreeView data={obj.data} />
  },
  text: {
    full: ({ obj }) => <TextView data={obj} />
  }
};

export default ({ obj, small }: { obj: Object, small: boolean }) => {
  const type = getType(obj);
  const compobj = components[type];
  if (compobj) {
    const Comp = small
      ? compobj['small'] || (() => type.toUpperCase())
      : compobj['full'];
    return (
      <Container>
        <Comp obj={obj} />
      </Container>
    );
  } else {
    // eslint-disable-next-line no-console
    console.warn('No renderer for this object type');
    return null;
  }
};
