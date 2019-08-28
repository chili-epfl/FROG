// @flow

import * as React from 'react';
import Measure from 'react-measure';

import MeanPerInterface from './MeanPerInterface';
import MeanPerTryForEachInterface from './MeanPerTryForEachInterface';

const styles = {
  flexGrid: {
    display: 'flex',
    padding: '40px',
    background: '#f5f8fa',
    flexWrap: 'wrap'
  },
  lg: {
    width: '25%',
    padding: '10px'
  },
  md: {
    width: '33%',
    padding: '10px'
  },
  sm: {
    width: '50%',
    padding: '10px'
  },
  xs: {
    width: '100%'
  }
};

const getComponentStyles = width => {
  if (width > 600 && width <= 960) {
    return 'sm';
  } else if (width > 960 && width <= 1280) {
    return 'md';
  } else if (width > 1280) {
    return 'lg';
  }

  return 'xs';
};

class AllDashboards extends React.Component<*, *> {
  state = {
    width: -1
  };

  render() {
    const { width } = this.state;

    const widthStyle = getComponentStyles(width);
    if (!this.props.dashboard || !this.props.state) {
      return (
        <h1>
          Did you consider the amount of time and errors that you made when
          purchasing the train tickets?
        </h1>
      );
    }

    return (
      <Measure
        style={{ height: '100%' }}
        bounds
        onResize={contentRect => {
          this.setState({ width: contentRect.bounds.width });
        }}
      >
        {({ measureRef }) => (
          <div ref={measureRef} style={styles.flexGrid}>
            <h1>
              Did you consider the amount of time and errors that you made when
              purchasing the train tickets?
            </h1>
            <div style={styles[widthStyle]}>
              <MeanPerTryForEachInterface {...this.props} whichDash="error" />
            </div>
            <div style={styles[widthStyle]}>
              <MeanPerTryForEachInterface {...this.props} whichDash="time" />
            </div>
            <div style={styles[widthStyle]}>
              <MeanPerInterface {...this.props} whichDash="time" />
            </div>
            <div style={styles[widthStyle]}>
              <MeanPerInterface {...this.props} whichDash="error" />
            </div>
            <div style={styles[widthStyle]}>
              <MeanPerInterface {...this.props} whichDash="help" />
            </div>
          </div>
        )}
      </Measure>
    );
  }
}

export default AllDashboards;
