// @flow

import React from 'react';
import { isEqual } from 'lodash';
import download from 'downloadjs';
import Masonry from 'react-masonry-component';
import ImageBox from './ImageBox';
import CategoryBox from './CategoryBox';

class ImageList extends React.Component<*, *> {
  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps.images, this.props.images);
  }
  render() {
    const {
      images,
      vote,
      minVoteT,
      canVote,
      userInfo,
      setZoom,
      setIndex,
      logger,
      LearningItem
    } = this.props;

    return (
      <Masonry>
        {images.map((image, i) => {
          const onClick = e => {
            if (canVote && e.shiftKey) {
              vote(image.key, userInfo.id);
            } else if (image.thumbnail || !image.filename) {
              setIndex(i);
              setZoom(true);
              logger({ type: 'zoom', itemId: image.key });
            } else {
              logger({
                type: 'download',
                itemId: image.key,
                value: image.filename
              });
              download(image.url, image.filename);
            }
          };

          const voteCount = Object.values(image.votes || {}).reduce(
            (n, v) => (v ? n + 1 : n),
            0
          );

          const styleCode =
            voteCount >= minVoteT
              ? 'chosen_by_team'
              : voteCount > 0
                ? 'chosen_partially'
                : 'not_chosen';

          return (
            <LearningItem
              key={JSON.stringify(image.li)}
              type="thumbView"
              id={image.li}
              render={props => (
                <div style={{ width: '400px', margin: '20px' }}>
                  <ImageBox
                    key={image.li.id || image.li}
                    color={image.votes[userInfo.id] ? 'lightgreen' : 'white'}
                    {...{ image, onClick, styleCode }}
                    {...props}
                  />
                </div>
              )}
            />
          );
        })}
      </Masonry>
    );
  }
}

const CategoryList = ({ categories, setCategory, logger }) => (
  <div>
    {Object.keys(categories).map(category => (
      <CategoryBox
        key={JSON.stringify(category)}
        category={category}
        setCategory={setCategory}
        logger={logger}
      />
    ))}
  </div>
);

const ThumbList = (props: Object) =>
  props.showCategories ? <CategoryList {...props} /> : <ImageList {...props} />;

ThumbList.displayName = 'ThumbList';
export default ThumbList;
