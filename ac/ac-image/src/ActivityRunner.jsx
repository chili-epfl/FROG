// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import Mousetrap from 'mousetrap';
import type { ActivityRunnerT } from 'frog-utils';

import ThumbList from './components/ThumbList';
import TopBar from './components/TopBar';
import UploadBar from './components/UploadBar';
import ZoomView from './components/ZoomView';
import WebcamInterface from './components/WebcamInterface';

const Main = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

class ActivityRunner extends Component {
  state: {
    zoomOn: boolean,
    index: number,
    category: string,
    webcamOn: boolean
  };

  categories: {
    [categoryName: string]: string[]
  };

  constructor(props: ActivityRunnerT) {
    super(props);
    Mousetrap.bind('esc', () => this.setState({ zoomOn: false }));

    const { data, activityData } = props;
    this.categories = Object.keys(data).reduce(
      (acc, key) => ({
        ...acc,
        all: [...(acc.all || []), data[key].url],
        ...(data[key].categories &&
          data[key].categories.reduce(
            (_acc, cat) => ({
              ..._acc,
              [cat]: [...(acc[cat] || []), data[key].url]
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

    const minVoteT = activityData.config.minVote || 1;

    const images = Object.keys(data)
      .filter(
        key =>
          data[key] !== undefined &&
          data[key].url !== undefined &&
          (this.state.category === 'all' ||
            (data[key].categories !== undefined &&
              data[key].categories.includes(this.state.category)))
      )
      .map(key => ({ ...data[key], key }));

    const vote = (key, userId) => {
      logger({ type: 'vote', itemId: key });
      const prev = data[key].votes ? data[key].votes[userId] : false;
      dataFn.objInsert(!prev, [key, 'votes', userId]);
      stream(!prev, [key, 'votes', userId]);
    };

    const setCategory = (c: string) => this.setState({ category: c });
    const setZoom = (z: boolean) => this.setState({ zoomOn: z });
    const setIndex = (i: number) => this.setState({ index: i });
    const setWebcam = (w: boolean) => this.setState({ webcamOn: w });

    const showCategories =
      this.state.category === 'categories' && !activityData.config.hideCategory;

    return (
      <Main>
        <TopBar
          categories={[...Object.keys(this.categories), 'categories']}
          category={this.state.category}
          canVote={activityData.config.canVote}
          {...{ setCategory, setZoom, showCategories }}
        />
        {images.length === 0 && this.state.category !== 'categories' ? (
          <h1>
            Please upload images by dropping files on the button below, or click
            the button to turn on the webcam
          </h1>
        ) : (
          <ThumbList
            {...{
              images,
              categories: this.categories,
              minVoteT,
              vote,
              userInfo,
              setCategory,
              setZoom,
              setIndex,
              logger,
              showCategories
            }}
            canVote={activityData.config.canVote}
          />
        )}
        {this.state.category !== 'categories' &&
          this.state.zoomOn && (
            <ZoomView
              index={this.state.index}
              commentBox={activityData.config.canComment}
              close={() => setZoom(false)}
              {...{ images, setIndex, dataFn, logger }}
            />
          )}
        {activityData.config.canUpload && (
          <UploadBar {...{ ...this.props, setWebcam }} />
        )}
        {this.state.webcamOn && (
          <WebcamInterface {...{ ...this.props, setWebcam }} />
        )}
      </Main>
    );
  }
}

ActivityRunner.displayName = 'ActivityRunner';
export default (props: ActivityRunnerT) => <ActivityRunner {...props} />;
