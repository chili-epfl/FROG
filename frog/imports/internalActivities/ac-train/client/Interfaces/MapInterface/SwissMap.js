// @flow
import React from 'react';

// UI
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  map: {
    width: '100%',
    height: 'auto'
  }
}));

const SwissMap = ({
  canSelectCity,
  position,
  elementDimensions,
  onClickCity
}: {
  canSelectCity: boolean,
  position: Object,
  elementDimensions: Object,
  onClickCity: Function
}) => {
  const classes = useStyles();
  return (
    <img
      id="map"
      src="/train/swissmap.png"
      className={classes.map}
      alt="swiss_map"
      style={{ cursor: canSelectCity ? 'pointer' : 'not-allowed' }}
      onClick={onClickCity(position, elementDimensions)}
    />
  );
};

export default SwissMap;
