// @flow

import * as React from 'react';
import { isEqual } from 'lodash';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import CategoryBox from './CategoryBox';

const styles = () => ({
  liBox: {
    display: 'inline-block',
    width: '400px',
    margin: '5px',
    padding: '5px',
    overflow: 'auto'
  },
  masonry: {
    columnWidth: '400px'
  }
});

class ImageList extends React.Component<*, *> {
  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps.learningItems, this.props.learningItems);
  }
  render() {
    const {
      classes,
      learningItems,
      vote,
      canVote,
      userInfo,
      setZoom,
      setIndex,
      logger,
      LearningItem,
      expand
    } = this.props;

    return (
      <div className={classes.masonry}>
        {learningItems.map((liObj, i) => {
          const onClick = e => {
            if (canVote && e.shiftKey) {
              vote(liObj.key, userInfo.id);
            } else if (!expand) {
              setIndex(i);
              setZoom(true);
              logger({ type: 'zoom', itemId: liObj.key });
            }
          };
          const backgroundColor = liObj.votes[userInfo.id]
            ? 'lightgreen'
            : 'white';

          return (
            <LearningItem
              key={liObj.key}
              type={expand ? 'view' : 'thumbView'}
              id={liObj.li}
              render={props => (
                <Paper
                  elevation={12}
                  onClick={onClick}
                  className={classes.liBox}
                  style={{ backgroundColor }}
                >
                  {props.children}
                </Paper>
              )}
            />
          );
        })}
      </div>
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
export default withStyles(styles)(ThumbList);
