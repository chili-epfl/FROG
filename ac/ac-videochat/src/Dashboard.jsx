// @flow

import React from 'react';

const Viewer = ({state}: Object) => {
    
    console.log(state);
    return (
        <div>
           <br/>
           {state.user}
        </div>
    );
};

const initData = {user: "Hello World"}

const mergeLog = (state, log) => {

    if(log.type === "videochat") {
        console.log(log);
        state.user = log.payload.name + " " + log.payload.type;
    }
}

export default {
    Viewer, initData, mergeLog
};

