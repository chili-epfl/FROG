// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import Mousetrap from 'mousetrap';
import type { ActivityRunnerT } from 'frog-utils';

import ThumbList from './components/ThumbList';
import TopBar from './components/TopBar';
import ZoomView from './components/ZoomView';

const Main = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

type ActivityRunnerStateT = {
  zoomOn: boolean,
  index: number,
  category: string,
  webcamOn: boolean
};

class ActivityRunner extends Component<ActivityRunnerT, ActivityRunnerStateT> {
  categories: {
    [categoryName: string]: string[]
  };

  constructor(props) {
    super(props);
    Mousetrap.bind('esc', () => this.setState({ zoomOn: false }));

    const { data } = props;
    // this.categories = Object.keys(data).reduce(
    //   (acc, key) => ({
    //     ...acc,
    //     all: [...(acc.all || []), data[key]],
    //     ...(data[key].categories &&
    //       data[key].categories.reduce(
    //         (_acc, cat) => ({
    //           ..._acc,
    //           [cat]: [...(acc[cat] || []), data[key]]
    //         }),
    //         {}
    //       ))
    //   }),
    //   {}
    // );

    // const startingCategory =
    //   Object.keys(this.categories).length > 1 &&
    //   !activityData.config.hideCategory
    //     ? 'categories'
    //     : 'all';

    this.state = {
      zoomOn: false,
      index: 0,
      category: 'all',
      webcamOn: false
    };
  }

  componentWillUnmount() {
    Mousetrap.unbind('esc');
  }

  render() {
    const {
      activityData,
      data,
      LearningItem,
      dataFn,
      userInfo,
      logger,
      stream
    } = this.props;
    const minVoteT = activityData.config.minVote || 1;

    // const images = Object.keys(data)
    //   .filter(
    //     key =>
    //       data[key] !== undefined &&
    //       data[key].url !== undefined &&
    //       (this.state.category === 'all' ||
    //         (data[key].categories !== undefined &&
    //           data[key].categories.includes(this.state.category)))
    //   )
    //   .map(key => ({ ...data[key], key }));

    const vote = (key, userId) => {
      logger({ type: 'vote', itemId: key });
      const prev = data[key].votes ? data[key].votes[userId] : false;
      dataFn.objInsert(!prev, [key, 'votes', userId]);
      stream(!prev, [key, 'votes', userId]);
    };

    const setCategory = (c: string) => this.setState({ category: c });
    const setZoom = (z: boolean) => this.setState({ zoomOn: z });
    const setIndex = (i: number) => this.setState({ index: i });

    const showCategories =
      this.state.category === 'categories' && !activityData.config.hideCategory;

    return (
      <Main>
        <ThumbList
          {...{
            images: data,
            categories: this.categories,
            minVoteT,
            vote,
            userInfo,
            setCategory,
            setZoom,
            setIndex,
            logger,
            showCategories,
            LearningItem
          }}
          canVote={activityData.config.canVote}
        />
        <LearningItem
          type="create"
          li="li-image"
          meta={{ comment: '' }}
          onCreate={e => dataFn.listAppend(e)}
        />
        <LearningItem
          meta={{ comment: '' }}
          type="create"
          onCreate={e => dataFn.listAppend(e)}
        />
        {this.state.category !== 'categories' &&
          this.state.zoomOn && (
            <ZoomView
              index={this.state.index}
              commentBox={activityData.config.canComment}
              commentGuidelines={activityData.config.commentGuidelines}
              close={() => setZoom(false)}
              {...{ images: data, LearningItem, setIndex, dataFn, logger }}
            />
          )}
      </Main>
    );
  }
}
// <TopBar
//   categories={[...Object.keys(this.categories), 'categories']}
//   category={this.state.category}
//   canVote={activityData.config.canVote}
//   hideCategory={activityData.config.hideCategory}
//   guidelines={activityData.config.guidelines}
//   {...{ setCategory, setZoom }}
// />
// {images.length === 0 && this.state.category !== 'categories' ? (
//   <h1>{activityData.config.acceptAnyFiles ? 'No file' : 'No image'}</h1>
// ) : (

ActivityRunner.displayName = 'ActivityRunner';
export default (props: ActivityRunnerT) => <ActivityRunner {...props} />;
