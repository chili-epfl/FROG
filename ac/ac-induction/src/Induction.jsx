// @flow

import React from "react";

import { type ActivityRunnerT } from "frog-utils";

import Images from "./Images";
import Rules from "./Rules";

export default ({
  // logger,
  activityData
}: // data,
// dataFn,
// userInfo
ActivityRunnerT) =>
  <div>
    <h4>{activityData.config.title}</h4>
    <Images
      style={{ width: 150, height: 200 }}
      srcURITrue="{activityData.config ? activityData.config.imgTrue : 'empty'}"
      srcURIFalse="{activityData.config ? activityData.config.imgFalse : 'empty'}"
    />
    <Rules
      style={{ width: 100, height: 200 }}
      generateNewPics={e => {
        formSubmitEvent.preventDefault();

        console.log("You have selected:", this.state.value);
      }}
      {...activityData.config}
    />
  </div>;
