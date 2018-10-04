// @flow

import * as React from 'react';
import { isEqual, debounce } from 'lodash';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';
import StarBorder from '@material-ui/icons/StarBorder';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import SvgIcon from '@material-ui/core/SvgIcon';

import CategoryBox from './CategoryBox';

const Star = props => (
  <SvgIcon {...props}>
    <path fill="none" d="M0 0h24v24H0V0z" />
    <path
      d="M19.47 9.16c-1.1-2.87-3.8-4.95-7.01-5.14l2 4.71 5.01.43zM11.54 4.02c-3.22.18-5.92 2.27-7.02 5.15l5.02-.43 2-4.72zM4.23 10.14C4.08 10.74 4 11.36 4 12c0 2.48 1.14 4.7 2.91 6.17l1.11-4.75-3.79-3.28zM19.77 10.13l-3.79 3.28 1.1 4.76C18.86 16.7 20 14.48 20 12c0-.64-.09-1.27-.23-1.87zM7.84 18.82c1.21.74 2.63 1.18 4.15 1.18 1.53 0 2.95-.44 4.17-1.18L12 16.31l-4.16 2.51z"
      opacity=".3"
      fill="#FFFF00"
    />
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm7.48 7.16l-5.01-.43-2-4.71c3.21.19 5.91 2.27 7.01 5.14zM12 8.06l1.09 2.56 2.78.24-2.11 1.83.63 2.73L12 13.98l-2.39 1.44.63-2.72-2.11-1.83 2.78-.24L12 8.06zm-.46-4.04l-2 4.72-5.02.43c1.1-2.88 3.8-4.97 7.02-5.15zM4 12c0-.64.08-1.26.23-1.86l3.79 3.28-1.11 4.75C5.14 16.7 4 14.48 4 12zm7.99 8c-1.52 0-2.94-.44-4.15-1.18L12 16.31l4.16 2.51c-1.22.74-2.64 1.18-4.17 1.18zm5.1-1.83l-1.1-4.76 3.79-3.28c.13.6.22 1.23.22 1.87 0 2.48-1.14 4.7-2.91 6.17z" />
  </SvgIcon>
);

const styles = () => ({
  liBox: {
    display: 'inline-block',
    width: '400px',
    margin: '20px',
    padding: '5px',
    overflow: 'auto'
  },
  masonry: {
    columnWidth: '400px'
  },
  star: { float: 'right' },
  starSelected: { float: 'right' },
  searchContainer: { display: 'flex', flexDirection: 'row' }
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
  state = { search: '', bookmarks: {}, onlyBookmarked: false };
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(nextProps.learningItems, this.props.learningItems) ||
      !isEqual(this.state, nextState)
    );
  }

  updateSearch = debounce(e => this.setState({ search: e.target.value }), 1000);

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
      canSearch,
      canBookmark,
      searchCollab
    } = this.props;
    const learningItemsFiltered = this.state.onlyBookmarked
      ? learningItems.filter(x => this.state.bookmarks[x.key])
      : learningItems;

    return (
      <div>
        <div className={classes.searchContainer}>
          {canSearch &&
            !searchCollab && (
              <TextField
                className={classes.margin}
                id="search"
                label="Search"
                onChange={e => {
                  e.persist();
                  this.updateSearch(e);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  )
                }}
              />
            )}
          {canBookmark && (
            <Switcher
              onlyShow={this.state.onlyBookmarked}
              toggleFn={() =>
                this.setState({ onlyBookmarked: !this.state.onlyBookmarked })
              }
            />
          )}
        </div>
        <div className={classes.masonry}>
          {learningItemsFiltered.map((liObj, i) => {
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
            const bookmarked = this.state.bookmarks[liObj.key];
            return (
              <LearningItem
                search={this.state.search.length > 0 && this.state.search}
                key={liObj.key}
                type={expand ? 'view' : 'thumbView'}
                id={liObj.li}
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
