// @flow
import React from 'react';

// UI
import { withStyles } from 'material-ui/styles';

const styles = {
  map: {
    width: '100%',
    height: 'auto'
  }
};

const SwissMap = ({
  classes,
  canSelectCity,
  position,
  elementDimensions,
  onClickCity
}: {
  classes: Object,
  canSelectCity: boolean,
  position: Object,
  elementDimensions: Object,
  onClickCity: Function
}) => (
  <img
    id="map"
    src="/train/swissmap.png"
    className={classes.map}
    alt="swiss_map"
    style={{ cursor: canSelectCity ? 'pointer' : 'not-allowed' }}
    onClick={onClickCity(position, elementDimensions)}
  />
);

export default withStyles(styles)(SwissMap);
