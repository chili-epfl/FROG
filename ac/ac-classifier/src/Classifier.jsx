// @flow

import React, { Component } from 'react';
import Mousetrap from 'mousetrap';
import styled from 'styled-components';
import { withState } from 'recompose';
import { findIndex } from 'lodash';

import ShortcutPanel, { shortcuts } from './components/ShortcutPanel';
import ObjectPanel from './components/ObjectPanel';
import ObjectList from './components/ObjectList';

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

const FlexDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 700px;
  padding: 5%;
  flex: 0 1 auto;
`;

export const getType = (obj: Object) => obj && (obj.url ? 'image' : obj.type);

const isSupportedType = type =>
  ['table', 'tree', 'image', 'text'].includes(type);

type RunnerStateT = {
  objectKeyPlus: string,
  objects: Object[],
  categories: string[]
};

class Runner extends Component<Object, RunnerStateT> {
  assignCategory = categoryName => {
    const { dataFn, setObjectKey } = this.props;
    const { objectKeyPlus } = this.state;
    if (!objectKeyPlus) return;
    dataFn.objInsert(categoryName, [objectKeyPlus, 'category']);
    this.props.logger({
      type: 'assign.category',
      itemId: objectKeyPlus,
      value: categoryName
    });
    setObjectKey(null);
  };

  assignSelect = () => {
    const { data, dataFn } = this.props;
    const { objectKeyPlus } = this.state;
    if (!objectKeyPlus) return;
    dataFn.objInsert(!data[objectKeyPlus].selected, [
      objectKeyPlus,
      'selected'
    ]);
    this.props.logger({ type: 'select', itemId: objectKeyPlus });
  };

  initProps(props) {
    const { data, objectKey, activityData } = props;
    const objects = Object.keys(data)
      .filter(x => data[x].key !== undefined)
      .map(key => data[key])
      .filter(x => isSupportedType(getType(x)));
    const objectKeyPlus =
      objectKey || (objects.find(obj => !obj.category) || {}).key;
    const categories = activityData.config.categories || [];
    this.setState({ objectKeyPlus, objects, categories });
  }

  bindAllMoustrap = categories => {
    categories.forEach((x, i) =>
      Mousetrap.bind(shortcuts[i], () => {
        this.assignCategory(x);
      })
    );
    Mousetrap.bind('s', this.assignSelect);
    Mousetrap.bind('left', () => this.moveIndex(-1));
    Mousetrap.bind('right', () => this.moveIndex(1));
  };

  unbindAllMoustrap = () => {
    // unbinds all the shortcuts
    shortcuts.split('').forEach(x => Mousetrap.unbind(x));
    // unbinds the selector key
    Mousetrap.unbind('s');
    Mousetrap.unbind('left');
    Mousetrap.unbind('right');
  };

  componentWillMount() {
    const { activityData } = this.props;
    this.initProps(this.props);
    const categories = activityData.config.categories || [];
    this.bindAllMoustrap(categories);
  }

  componentWillReceiveProps(nextProps) {
    this.initProps(nextProps);
  }

  componentWillUnmount() {
    this.unbindAllMoustrap();
  }

  moveIndex(direction: number) {
    const index = findIndex(
      this.state.objects,
      x => x.key === this.state.objectKeyPlus
    );
    if (this.state.objects[index + direction]) {
      this.props.setObjectKey(this.state.objects[index + direction].key);
    }
  }

  render() {
    const { activityData, data, dataFn, setObjectKey } = this.props;
    const { objectKeyPlus, objects, categories } = this.state;
    return (
      <Main>
        <h2>{activityData.config.title}</h2>
        {objectKeyPlus ? (
          <FlexDiv>
            <ObjectPanel obj={data[objectKeyPlus]} small={false} />
            {categories.length > 0 && (
              <ShortcutPanel
                {...{
                  categories,
                  dataFn,
                  data,
                  assignCategory: this.assignCategory,
                  objectKey: objectKeyPlus
                }}
              />
            )}
          </FlexDiv>
        ) : (
          <h1>Waiting for objects to classify</h1>
        )}
        <ObjectList {...{ objects, objectKey: objectKeyPlus, setObjectKey }} />
      </Main>
    );
  }
}

export default withState('objectKey', 'setObjectKey', null)(Runner);
