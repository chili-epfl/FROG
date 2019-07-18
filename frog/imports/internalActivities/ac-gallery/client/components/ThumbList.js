// @flow

import * as React from 'react';
import { isEqual } from 'lodash';
import { SearchField } from '/imports//imports/frog-utils';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import StarBorder from '@material-ui/icons/StarBorder';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import SvgIcon from '@material-ui/core/SvgIcon';
import Button from '@material-ui/core/Button';

import CategoryBox from './CategoryBox';

const Star = props => (
  <SvgIcon {...props}>
    <React.Fragment>
      <g fill="none">
        <path d="M0 0h24v24H0V0z" />
        <path d="M0 0h24v24H0V0z" />
      </g>
      <path
        d="M12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28z"
        opacity=".7"
        fill="#FFFF00"
      />
      <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
    </React.Fragment>
    , 'Star');
  </SvgIcon>
);

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
  },
  star: { float: 'right', color: '#CCCCCC' },
  starSelected: { float: 'right' },
  searchContainer: { display: 'flex', flexDirection: 'row' },
  margin: { marginRight: '40px' }
});

const Switcher = ({ onlyShow, toggleFn }) => (
  <FormGroup row>
    <FormControlLabel
      control={<Switch checked={onlyShow} onChange={toggleFn} />}
      label="Only show starred items"
    />
  </FormGroup>
);

class ImageList extends React.Component<*, *> {
  state = { filter: '', bookmarks: {}, onlyBookmarked: false };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(nextProps.learningItems, this.props.learningItems) ||
      !isEqual(this.state, nextState)
    );
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
      expand,
      showUserName,
      canSearch,
      canBookmark,
      openEdit
    } = this.props;
    const learningItemsFiltered = this.state.onlyBookmarked
      ? learningItems.filter(x => this.state.bookmarks[x.key])
      : learningItems;

    return (
      <div>
        <div className={classes.searchContainer}>
          {canSearch && (
            <SearchField
              logger={this.props.logger}
              classes={classes}
              onChange={e => {
                this.setState({ filter: e.toLowerCase() });
                this.props.logger({
                  type: e.trim() === '' ? 'resetSearch' : 'search',
                  value: e
                });
              }}
            />
          )}
          {canBookmark && (
            <>
              <Switcher
                className={classes.margin}
                onlyShow={this.state.onlyBookmarked}
                toggleFn={() => {
                  this.setState({ onlyBookmarked: !this.state.onlyBookmarked });
                  logger({
                    type: 'setOnlyStarred',
                    value: (!this.state.onlyBookmarked).toString()
                  });
                }}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  this.setState({ bookmarks: {}, onlyBookmarked: false });
                  logger({ type: 'clearAllStars' });
                }}
              >
                Clear all stars
              </Button>
            </>
          )}
        </div>
        <div className={classes.masonry}>
          {learningItemsFiltered.map((liObj, i) => {
            const onClick = e => {
              if (canVote && e.shiftKey) {
                vote(liObj.key, userInfo.id);
              } else if (!expand && !openEdit) {
                setIndex(i);
                setZoom(true);
                logger({ type: 'zoom', itemId: liObj.key });
              }
            };
            const backgroundColor = liObj.votes[userInfo.id]
              ? 'lightgreen'
              : 'white';
            const bookmarked = this.state.bookmarks[liObj.key];
            return (
              <LearningItem
                search={this.state.filter.length > 0 && this.state.filter}
                key={liObj.key}
                type={openEdit ? 'edit' : expand ? 'view' : 'thumbView'}
                id={liObj.li}
                notEmpty
                render={props => (
                  <Paper
                    elevation={12}
                    className={classes.liBox}
                    style={{ backgroundColor }}
                    onClick={onClick}
                  >
                    {canBookmark && (
                      <div
                        onClick={() => {
                          this.props.logger({
                            type: bookmarked ? 'unstar' : 'star',
                            itemId: liObj.key
                          });
                          this.setState({
                            bookmarks: {
                              ...this.state.bookmarks,
                              [liObj.key]: !bookmarked
                            }
                          });
                        }}
                      >
                        {bookmarked ? (
                          <Star classes={{ root: classes.starSelected }} />
                        ) : (
                          <StarBorder className={classes.star} />
                        )}
                      </div>
                    )}
                    {props.children}
                    {showUserName && liObj.username && <i>{liObj.username}</i>}
                  </Paper>
                )}
              />
            );
          })}
        </div>
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
