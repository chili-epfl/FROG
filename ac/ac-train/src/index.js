// @flow

import { type ActivityPackageT } from 'frog-utils';
import ActivityRunner from './ActivityRunner';
import dashboards from './Dashboards';

const interfaceExample = int => ({
  title: `${int} interface`,
  type: 'deeplink',
  config: {
    timeOfEachIteration: 600000,
    iterationPerInterface: 5,
    ticketStatusDisplayTime: 1000,
    interface: int
  },
  data: {}
});

const meta = {
  name: 'Train Activity',
  shortDesc: 'New activity, no description available',
  description: 'New activity, no description available',
  exampleData: [
    {
      title: 'Slow',
      config: {
        timeOfEachIteration: 60000,
        iterationPerInterface: 5,
        ticketStatusDisplayTime: 1000
      },
      data: {}
    },
    {
      title: 'Quick',
      config: {
        timeOfEachIteration: 10000,
        iterationPerInterface: 5,
        ticketStatusDisplayTime: 1000
      },
      data: {}
    },
    {
      title: 'Supersonic',
      config: {
        timeOfEachIteration: 1500,
        iterationPerInterface: 5,
        ticketStatusDisplayTime: 500
      },
      data: {}
    },
    ...['dragdrop', 'form', 'command', 'graphical'].map(x =>
      interfaceExample(x)
    )
  ]
};

const config = {
  type: 'object',
  required: ['timeOfEachIteration', 'iterationPerInterface'],
  properties: {
    timeOfEachIteration: {
      title: 'Length of each iteration',
      type: 'number',
      default: 10000
    },
    iterationPerInterface: {
      title: 'Number of iterations per interface',
      type: 'number',
      default: 5
    },
    ticketStatusDisplayTime: {
      title: 'Time to show ticket validation status',
      type: 'number',
      default: 2000
    }
  }
};

const dataStructure = {
  progress: 0,
  time: 0,
  step: 0,
  guidelines: true,
  iteration: 0
};

export default ({
  id: 'ac-train',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  dashboards,
  dataStructure
}: ActivityPackageT);
