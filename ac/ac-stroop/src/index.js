// @flow

import React from 'react';
import { type ActivityPackageT } from 'frog-utils';
import { Button } from 'react-bootstrap';

const meta = {
  name: 'Stroop Effect',
  shortDesc: 'New activity, no description available',
  description: 'New activity, no description available',
  exampleData: [
    {
      title: 'Case with no data',
      config: {
        guidelines: 'Do that!',
        objects: 'lemons,wood,a tomato,grass,the sky',
        colors: 'yellow,brown,red,green,blue',
      },
      data: {}
    }
  ]
};

const config = {
  type: 'object',
  properties: {
    guidelines: {
      title: 'Guidelines',
      type: 'string'
    },
    objects: {
      title: 'Comma separated objects',
      type: 'string'
    },
    colors: {
      title: 'Color of previous objects (in same order)',
      type: 'string'
    },
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = (object, dataFn) => {};


const styles = {
  button: { width: '70px', margin: 'auto', position: 'absolute' },
  text: { width: '100%', fontSize: 'xx-large', textAlign: 'center' },
  container: { width: '500px', height: '400px', margin: 'auto', marginTop: '80px' },
  commands: { width: '200px', height: '50px', margin: 'auto', position: 'relative', marginTop:'50px'}
}

const Question = ({ objectName, colorName, colorFill}) =>
  <div style={styles.text}>
    The color of {objectName} is{' '}
    <span style={{color: colorFill}}>{colorName}</span>
  </div>

// the actual component that the student sees
const ActivityRunner = ({ logger, activityData, data, dataFn, userInfo }) => {
  const colors = ['a','b','c']
  return (
    <div style={styles.container}>
      <Question objectName="the sky" colorName="blue" colorFill="red" />
      <div style={styles.commands}>
        <Button style={{...styles.button, left:0}}>Yes</Button>
        <Button style={{...styles.button, right:0}}>No</Button>
      </div>
    </div>
  );
}

export default ({
  id: 'ac-stroop',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  Dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
