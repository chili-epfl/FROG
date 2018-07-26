// @flow

import { type ActivityPackageT } from 'frog-utils';
import { isEmpty, isObject } from 'lodash';

import ActivityRunner from './ActivityRunner'

const meta = {
  name: 'Plot statistical data',
  shortDesc: 'Allow the student to see various plots of some data',
  description: 'Allow the student to see various plots of data chosen by the teacher or the student',
  exampleData: [
    {
      title: 'Linear 2 points', config: { title: 'Graph1', plotType: 'lines'},
      data: {points: [[0,0],[4,-2]]}
    },
    {
      title: 'Random 100 points step 1', config: { title: 'Graph2', plotType: 'all'},
      data: {
        trace1: [[0, 2], [1, 3], [2, 2], [3, 8], [4, 15], [5, 11], [6, 22], [7, 25], [8, 21], [9, 11], [10, 4], [11, 5], [12, 11], [13, 18], [14, 20], [15, 4], [16, 14], [17, 20], [18, 9], [19, 6], [20, 5], [21, 9], [22, 17], [23, 4], [24, 20], [25, 5], [26, 16], [27, 22], [28, 18], [29, 17], [30, 22], [31, 18], [32, 11], [33, 12], [34, 9], [35, 19], [36, 19], [37, 1], [38, 2], [39, 4], [40, 25], [41, 11], [42, 3], [43, 19], [44, 20], [45, 2], [46, 12], [47, 19], [48, 4], [49, 24], [50, 13], [51, 12], [52, 3], [53, 15], [54, 15], [55, 7], [56, 9], [57, 13], [58, 12], [59, 18], [60, 20], [61, 20], [62, 25], [63, 24], [64, 10], [65, 24], [66, 12], [67, 16], [68, 19], [69, 5], [70, 11], [71, 7], [72, 6], [73, 8], [74, 5], [75, 22], [76, 4], [77, 15], [78, 9], [79, 13], [80, 4], [81, 13], [82, 17], [83, 21], [84, 10], [85, 11], [86, 2], [87, 6], [88, 18], [89, 0], [90, 8], [91, 18], [92, 8], [93, 0], [94, 6], [95, 24], [96, 9], [97, 4], [98, 25], [99, 17]]
      }
    },
    {
      title: 'log 100 points and linear', config: { title: 'Graph3', plotType: 'all'},
      data: {
        trace1: [[0, 2], [1, 3], [2, 2], [3, 8], [4, 15], [5, 11], [6, 22], [7, 25], [8, 21], [9, 11], [10, 4], [11, 5], [12, 11], [13, 18], [14, 20], [15, 4], [16, 14], [17, 20], [18, 9], [19, 6], [20, 5], [21, 9], [22, 17], [23, 4], [24, 20], [25, 5], [26, 16], [27, 22], [28, 18], [29, 17], [30, 22], [31, 18], [32, 11], [33, 12], [34, 9], [35, 19], [36, 19], [37, 1], [38, 2], [39, 4], [40, 25], [41, 11], [42, 3], [43, 19], [44, 20], [45, 2], [46, 12], [47, 19], [48, 4], [49, 24], [50, 13], [51, 12], [52, 3], [53, 15], [54, 15], [55, 7], [56, 9], [57, 13], [58, 12], [59, 18], [60, 20], [61, 20], [62, 25], [63, 24], [64, 10], [65, 24], [66, 12], [67, 16], [68, 19], [69, 5], [70, 11], [71, 7], [72, 6], [73, 8], [74, 5], [75, 22], [76, 4], [77, 15], [78, 9], [79, 13], [80, 4], [81, 13], [82, 17], [83, 21], [84, 10], [85, 11], [86, 2], [87, 6], [88, 18], [89, 0], [90, 8], [91, 18], [92, 8], [93, 0], [94, 6], [95, 24], [96, 9], [97, 4], [98, 25], [99, 17]],
        trace2: [[0, 7.440151952041672e-43], [1, 2.0224429852208967e-42], [2, 5.49757001582043e-42], [3, 1.4943944674685981e-41], [4, 4.0621853254696216e-41], [5, 1.1042164554057065e-40], [6, 3.0015715254147894e-40], [7, 8.159117334355119e-40], [8, 2.2178780386242727e-39], [9, 6.028817570130749e-39], [10, 1.638802524798103e-38], [11, 4.454727123591487e-38], [12, 1.210920379080237e-37], [13, 3.291622862164547e-37], [14, 8.947558612362242e-37], [15, 2.432198598505651e-36], [16, 6.611401253521468e-36], [17, 1.797165188809876e-35], [18, 4.885201475481055e-35], [19, 1.3279354399161467e-34], [20, 3.6097027756908296e-34], [21, 9.81218946129856e-34], [22, 2.6672296310045227e-33], [23, 7.250281838287118e-33], [24, 1.9708309372222514e-32], [25, 5.357273923616155e-32], [26, 1.4562580356643287e-31], [27, 3.958519755893809e-31], [28, 1.0760372320042274e-30], [29, 2.924972454502462e-30], [30, 7.950899471817294e-30], [31, 2.161278555414557e-29], [32, 5.874964223421605e-29], [33, 1.5969808491373955e-28], [34, 4.341044022607279e-28], [35, 1.1800181083194122e-27], [36, 3.2076217810972755e-27], [37, 8.719220000126161e-27], [38, 2.3701297284679617e-26], [39, 6.442680571985031e-26], [40, 1.7513021525393041e-25], [41, 4.7605328173888e-25], [42, 1.294046985129092e-24], [43, 3.517584404848623e-24], [44, 9.561785767770938e-24], [45, 2.599162850015006e-23], [46, 7.065257144401613e-23], [47, 1.9205360109017353e-22], [48, 5.22055813933541e-22], [49, 1.4190948324569409e-21], [50, 3.8574996959278346e-21], [51, 1.0485771326726927e-20], [52, 2.85032816548187e-20], [53, 7.747995257374374e-20], [54, 2.1061234715107625e-19], [55, 5.725037161098787e-19], [56, 1.5562264482267591e-18], [57, 4.23026207518216e-18], [58, 1.1499044528587118e-17], [59, 3.1257643786699776e-17], [60, 8.496708510583178e-17], [61, 2.309644834603157e-16], [62, 6.278265584096058e-16], [63, 1.7066095251488131e-15], [64, 4.6390456604871385e-15], [65, 1.261023352029398e-14], [66, 3.427816863084026e-14], [67, 9.317772290206793e-14], [68, 2.532833109818835e-13], [69, 6.884954216939952e-13], [70, 1.8715245937680345e-12], [71, 5.087331294753846e-12], [72, 1.3828800213880405e-11], [73, 3.759057633078166e-11], [74, 1.0218178056126648e-10], [75, 2.777588772992804e-10], [76, 7.550269088558195e-10], [77, 2.052375926340378e-09], [78, 5.57893618573785e-09], [79, 1.516512085582381e-08], [80, 4.122307244877115e-08], [81, 1.1205592875074534e-07], [82, 3.045995948942525e-07], [83, 8.279875437570333e-07], [84, 2.2507034943851824e-06], [85, 6.118046410036515e-06], [86, 1.6630574382071357e-05], [87, 4.520658813962108e-05], [88, 0.00012288424706656417], [89, 0.0003340340158049132], [90, 0.0009079985952496969], [91, 0.002468196081733591], [92, 0.006709252558050236], [93, 0.018237639311090324], [94, 0.049575043533327166], [95, 0.13475893998170935], [96, 0.3663127777746836], [97, 0.9957413673572788], [98, 2.7067056647322536], [99, 7.357588823428846]]
      }
    }
  ]
};

const config = {
  type: 'object',
  properties: {
    title: {
      title: 'What is the title of the graph?',
      type: 'string'
    },
    plotType: {
      type: 'string',
      title: 'Kind of plot to display:',
      enum: ['all','lines', 'dots', 'dots+lines', 'box', 'bar'],
      default: 'all'
    },
    xLabel: {
      title: 'X label',
      type: 'string',
      default: 'x'
    },
    yLabel: {
      title: 'Y label',
      type: 'string',
      default: 'y'
    }
  }
};

const dataStructure = [];

const mergeFunction = (object, dataFn) => {
  if (isEmpty(object.data) || !isObject(object.data)) {
    return;
  }
  Object.values(object.data).forEach(trace => {
    dataFn.listAppend({
      x: trace.map(p => p[0]),
      y: trace.map(p => p[1])
    });
  })


};

export default ({
  id: 'ac-plot',
  type: 'react-component',
  configVersion: 1,
  meta,
  config,
  ActivityRunner,
  dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
