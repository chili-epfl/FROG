// @flow

import * as React from 'react';
import { isEqual, debounce } from 'lodash';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';

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
  state = { search: '' };
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(nextProps.learningItems, this.props.learningItems) ||
      this.state.search !== nextState.search
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
      searchCollab
    } = this.props;

    return (
      <div>
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
                search={this.state.search.length > 0 && this.state.search}
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
