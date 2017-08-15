// @flow

import React from 'react';
import { type ActivityPackageT } from 'frog-utils';
import {withState} from 'recompose';
//import Mousetrap from 'mousetrap';

const meta = {
  name: 'Image Classifier',
  type: 'react-component',
  shortDesc: 'New activity, no description available',
  description: 'New activity, no description available',
  exampleData: [
    { title: 'Case with no data', config: { title: 'No data' }, data: {} }
  ]
};

const config = {
  type: 'object',
  properties: {
    title: {
      title: 'What is the title?',
      type: 'string'
    },
    images: {
      title: 'Images to display',
      type: 'array',
      items: {
        type: 'string',
        title: 'Image URL'
      }
    },
    categories: {
      title: 'Categories',
      type: 'array',
      items: {
        type: 'string',
        title: 'Category'
      }
    }
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = (object, dataFn) => {};

// the actual component that the student sees
const ActivityRunner = withState('index', 'setIndex', 0)(({index, setIndex, activityData, data, dataFn, userInfo }) =>
  <div>
    <h4> {activityData.config.title} </h4>
    <div style={{display: 'flex', flexDirection: 'row', width: '100%', height: '90%'}}>
      <img alt='' src={activityData.config.images[index]} style={{maxWidth: '80%', maxHeight: '100%'}}/>
      <ul className="list-group" style={{width: '20%'}}>
        {
          activityData.config.categories.map((x,i) => {
            console.log(i);
            Mousetrap.bind(i.toString, () => console.log('toto'));
            <li key={i} className="list-group-item"> {i} <span className='glyphicon glyphicon-arrow-right'/> {x} </li>
          })
        }
      </ul>
    </div>
  </div>);

export default ({
  id: 'ac-imgClass',
  meta,
  config,
  ActivityRunner,
  Dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
