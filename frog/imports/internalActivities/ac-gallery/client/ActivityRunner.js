// @flow

import * as React from 'react';
import Mousetrap from 'mousetrap';
import type { ActivityRunnerPropsT } from '/imports/frog-utils';

import ThumbList from './components/ThumbList';
import TopBar from './components/TopBar';
import ZoomView from './components/ZoomView';

type ActivityRunnerStateT = {
  zoomOn: boolean,
  index: number,
  category: string,
  webcamOn: boolean
};

class ActivityRunner extends React.Component<
  ActivityRunnerPropsT,
  ActivityRunnerStateT
> {
  categories: {
    [categoryName: string]: string[]
  };

  constructor(props: ActivityRunnerPropsT) {
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
    const { activityData, data, dataFn, userInfo, logger, stream } = this.props;
    const { category, index, zoomOn } = this.state;
    const config = activityData.config;

    const minVoteT = config.minVote || 1;

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

    const showCategories = category === 'categories' && !config.hideCategory;

    return (
      <>
        {config.guidelines}
        <TopBar
          categories={[...Object.keys(this.categories)]}
          canVote={config.canVote}
          hideCategory={config.hideCategory}
          guidelines={config.guidelines}
          {...{ setCategory, setZoom, category }}
        />
        <ThumbList
          {...{
            openEdit: config.openEdit,
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
            expand: config.expand,
            showUserName: config.showUserName,
            LearningItem: dataFn.LearningItem,
            canSearch: config.canSearch,
            searchCollab: config.searchCollab,
            canBookmark: config.canBookmark
          }}
          canVote={config.canVote}
        />
        {config.provideDefault && (
          <div style={{ position: 'absolute', bottom: '10px', width: '800px' }}>
            <dataFn.LearningItem
              liType={config.liType}
              stream={stream}
              meta={{
                comment: '',
                userid: userInfo.id,
                username: userInfo.name,
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
        {config.allowAny && (
          <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
            <dataFn.LearningItem
              stream={stream}
              meta={{
                comment: '',
                userid: userInfo.id,
                username: userInfo.name,
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
        {category !== 'categories' && zoomOn && (
          <ZoomView
            key={index}
            index={index}
            showUserName={config.showUserName}
            commentBox={config.canComment}
            commentGuidelines={config.commentGuidelines}
            close={() => setZoom(false)}
            bigZoom={config.bigZoom}
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
export default ActivityRunner;
