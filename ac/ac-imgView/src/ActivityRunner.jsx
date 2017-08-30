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

  constructor(props: ActivityRunnerT) {
    super(props);
    Mousetrap.bind('esc', () => this.setState({ zoomOn: false }));
    this.state = { zoomOn: false, index: 0, category: 'all', webcamOn: false };
  }

  componentWillUnmount() {
    Mousetrap.unbind('esc');
  }

  render() {
    const { activityData, data, dataFn, uploadFn, userInfo } = this.props;

    const minVoteT = activityData.config.minVote || 1;

    const categories = Object.keys(data).reduce(
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
      const prev = data[key].votes ? data[key].votes[userId] : false;
      dataFn.objInsert(!prev, [key, 'votes', userId]);
      const countVote = Object.values(data[key].votes).reduce(
        (n, v) => (v ? n + 1 : n),
        0
      );
      if (prev && countVote < minVoteT)
        dataFn.objInsert(data[key].categories.filter(x => x !== 'selected'), [
          key,
          'categories'
        ]);
      else if (!prev && countVote >= minVoteT)
        dataFn.objInsert(
          [...data[key].categories, 'selected'],
          [key, 'categories']
        );
    };

    const setCategory = (c: string) => this.setState({ category: c });
    const setZoom = (z: boolean) => this.setState({ zoomOn: z });
    const setIndex = (i: number) => this.setState({ index: i });
    const setWebcam = (w: boolean) => this.setState({ webcamOn: w });

    return (
      <Main>
        <TopBar
          categories={[...Object.keys(categories), 'categories']}
          category={this.state.category}
          canVote={activityData.config.canVote}
          {...{ setCategory, setZoom }}
        />
        <ThumbList
          {...{
            images,
            categories,
            minVoteT,
            vote,
            userInfo,
            setCategory,
            setZoom,
            setIndex
          }}
          canVote={activityData.config.canVote}
          showingCategories={this.state.category === 'categories'}
        />
        {this.state.category !== 'categories' &&
          this.state.zoomOn &&
          <ZoomView
            index={this.state.index}
            {...{ close: () => setZoom(false), images, setIndex }}
          />}

        {activityData.config.canUpload &&
          <UploadBar
            data={data}
            dataFn={dataFn}
            uploadFn={uploadFn}
            setWebcam={setWebcam}
          />}
        {this.state.webcamOn &&
          <WebcamInterface
            data={data}
            dataFn={dataFn}
            uploadFn={uploadFn}
            setWebcam={setWebcam}
          />}
      </Main>
    );
  }
}

ActivityRunner.displayName = 'ActivityRunner';
export default (props: ActivityRunnerT) => <ActivityRunner {...props} />;
