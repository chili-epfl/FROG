// @flow

import React from 'react';
import { withStyles } from '@material-ui/styles';
import { type LogT, HTML } from '/imports/frog-utils';

const styles = () => ({
  container: {
    position: 'relative',
    border: 'solid 2px #a0a0a0',
    background: 'none',
    maxWidth: '250px',
    height: '250px',
    width: '100%',
    margin: '5px',
    padding: '0px',
    flex: '0 1 auto',
    display: 'flex',
    flexFlow: 'row wrap',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    height: '10%',
    fontSize: '3em',
    bottom: '0px'
  }
});

const CategoryBox = ({
  category,
  setCategory,
  logger,
  classes
}: {
  category: string,
  setCategory: Function,
  logger: LogT => void,
  classes: Object
}) => (
  <button
    className={classes.container}
    onClick={() => {
      logger({ type: 'category.enter', value: category });
      setCategory(category);
    }}
  >
    <span className={classes.text}>
      <HTML html={category} />
    </span>
  </button>
);

CategoryBox.displayName = 'CategoryBox';
export default withStyles(styles)(CategoryBox);
