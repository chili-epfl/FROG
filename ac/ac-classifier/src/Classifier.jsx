// @flow

import React, { Component } from 'react';
import Mousetrap from 'mousetrap';
import styled from 'styled-components';
import { withState, compose } from 'recompose';
import { findIndex } from 'lodash';

import ShortcutPanel, { shortcuts } from './components/ShortcutPanel';
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

type RunnerStateT = {
  objectKeyPlus: string,
  objects: Object[],
  categories: string[]
};
class Runner extends Component<Object, RunnerStateT> {
  constructor(props) {
    super(props);
    this.state = {
      objectKeyPlus: props.data.length > 0 && props.data[0],
      categories: this.props.activityData.config.categories
    };
  }

  assignSelect = () => this.props.ourDataFn.objInsert(true, 'selected');
  assignCategory = e => this.props.ourDataFn.objInsert(e, 'category');

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
    const categories = activityData.config.categories || [];
    this.bindAllMoustrap(categories);
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
    const { activityData, objectKey, data, dataFn, setObjectKey } = this.props;
    const { objectKeyPlus, objects, categories } = this.state;
    return (
      <Main>
        <h2>{activityData.config.title}</h2>
        <FlexDiv>
          {objectKey && (
            <this.props.LearningItem id={objectKey} type="history" />
          )}
          {categories.length > 0 && (
            <div style={{ position: 'absolute', right: '20px' }}>
              <ShortcutPanel
                {...{
                  categories,
                  dataFn: this.props.ourDataFn,
                  data,
                  assignCategory: this.assignCategory,
                  objectKey: objectKey
                }}
              />
            </div>
          )}
        </FlexDiv>
        <ObjectList
          {...{
            LearningItem: this.props.LearningItem,
            objects: data,
            objectKey: objectKey,
            setObjectKey,
            setDataFn: this.props.setDataFn
          }}
        />
      </Main>
    );
  }
}

export default compose(
  withState('ourDataFn', 'setDataFn', undefined),
  withState('objectKey', 'setObjectKey', null)
)(Runner);
