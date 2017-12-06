// @flow

import React from 'react';
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
import {type ActivityPackageT} from 'frog-utils';
import {config} from "./config";
import { meta } from './meta';
import Main from './Main';

const muiTheme = createMuiTheme({
    palette: {
        type: 'light', // Switching the dark mode on is a single property value change.
    },
});

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = (object, dataFn) => {
};

// the actual component that the student sees
const ActivityRunner = ({logger, activityData, data, dataFn, userInfo}) => (
    <MuiThemeProvider theme={muiTheme}>
        <Main {...{logger, activityData, userInfo, data, dataFn}} />
    </MuiThemeProvider>
);
export default ({
    id: 'ac-ck-student',
    type: 'react-component',
    meta,
    config,
    ActivityRunner,
    Dashboard: null,
    dataStructure,
    mergeFunction
}: ActivityPackageT);
