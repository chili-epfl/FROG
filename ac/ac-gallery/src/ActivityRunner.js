// @flow

import React, { Component } from 'react';
import Mousetrap from 'mousetrap';
import type { ActivityRunnerPropsT } from 'frog-utils';

import ThumbList from './components/ThumbList';
import TopBar from './components/TopBar';
import ZoomView from './components/ZoomView';

type ActivityRunnerStateT = {
  zoomOn: boolean,
  index: number,
  category: string,
  webcamOn: boolean
};

class ActivityRunner extends Component<
  ActivityRunnerPropsT,
  ActivityRunnerStateT
> {
  categories: {
    [categoryName: string]: string[]
  };

  constructor(props) {
    super(props);
    Mousetrap.bind('esc', () => this.setState({ zoomOn: false }));

    const { data, activityData } = props;
    this.categories = Object.keys(data || {}).reduce(
      (acc, key) => ({
        ...acc,
        all: [...(acc.all || []), data[key]],
        ...(data[key].categories &&
          data[key].categories.reduce(
            (_acc, cat) => ({
              ..._acc,
              [cat]: [...(acc[cat] || []), data[key]]
            }),
            {}
          ))
      }),
      {}
    );

    const startingCategory =
      Object.keys(this.categories).length > 1 &&
      !activityData.config.hideCategory
        ? 'categories'
        : 'all';

    this.state = {
      zoomOn: false,
      index: 0,
      category: startingCategory,
      webcamOn: false
    };
  }

  componentWillUnmount() {
    Mousetrap.unbind('esc');
  }

  render() {
    const { activityData, data, dataFn, userInfo, logger } = this.props;
    const { category } = this.state;

    const minVoteT = activityData.config.minVote || 1;

    const learningItems = Object.keys(data)
      .map(key => ({ ...data[key], key }))
      .filter(
        liObj =>
          category === 'all' ||
          (liObj.categories !== undefined &&
            liObj.categories.includes(category))
      );

    const vote = (key, userId) => {
      logger({ type: 'vote', itemId: key });
      const prev = data[key].votes ? data[key].votes[userId] : false;
      dataFn.objInsert(!prev, [key, 'votes', userId]);
    };

    const setCategory = (c: string) => this.setState({ category: c });
    const setZoom = (z: boolean) => this.setState({ zoomOn: z });
    const setIndex = (i: number) => this.setState({ index: i });

    const showCategories =
      category === 'categories' && !activityData.config.hideCategory;

    return (
      <>
        <TopBar
          categories={[...Object.keys(this.categories)]}
          canVote={activityData.config.canVote}
          hideCategory={activityData.config.hideCategory}
          guidelines={activityData.config.guidelines}
          {...{ setCategory, setZoom, category }}
        />
        <ThumbList
          {...{
            learningItems,
            categories: this.categories,
            minVoteT,
            vote,
            userInfo,
            setCategory,
            setZoom,
            setIndex,
            logger,
            showCategories,
            expand: activityData.config.expand,
            LearningItem: dataFn.LearningItem,
            canSearch: activityData.config.canSearch,
            searchCollab: activityData.config.searchCollab,
            canBookmark: activityData.config.canBookmark
          }}
          canVote={activityData.config.canVote}
        />
        {activityData.config.provideDefault && (
          <div style={{ position: 'absolute', bottom: '10px', width: '800px' }}>
            <dataFn.LearningItem
              liType={activityData.config.liType}
              stream={this.props.stream}
              meta={{
                comment: '',
                votes: {},
                categories:
                  category && category !== 'categories' && category !== 'all'
                    ? category
                    : []
              }}
              type="create"
              autoInsert
            />
          </div>
        )}
        {activityData.config.allowAny && (
          <div style={{ position: 'absolute', top: '50px', right: '59px' }}>
            <dataFn.LearningItem
              stream={this.props.stream}
              meta={{
                comment: '',
                votes: {},
                categories:
                  category && category !== 'categories' && category !== 'all'
                    ? category
                    : []
              }}
              type="create"
              autoInsert
            />
          </div>
        )}
        {category !== 'categories' &&
          this.state.zoomOn && (
            <ZoomView
              index={this.state.index}
              commentBox={activityData.config.canComment}
              commentGuidelines={activityData.config.commentGuidelines}
              close={() => setZoom(false)}
              {...{
                learningItems,
                LearningItem: dataFn.LearningItem,
                setIndex,
                dataFn,
                logger
              }}
            />
          )}
      </>
    );
  }
}

ActivityRunner.displayName = 'ActivityRunner';
export default (props: ActivityRunnerPropsT) => <ActivityRunner {...props} />;
