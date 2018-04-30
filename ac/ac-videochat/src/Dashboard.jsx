// @flow

import React from 'react';

const Viewer = ({state}: Object) => {
    
    console.log(state);
    return (
        <div>
           {state.count}
           <br/>
           {state.any}
        </div>
    );
};

const initData = {any: "Hello World", count: 0}

const mergeLog = (state, log) => {
    if(log.type === "videochat") {
        state.count += 1;
        state.any = log.payload.name;
    }
}

export default {
    Viewer, initData, mergeLog
};

