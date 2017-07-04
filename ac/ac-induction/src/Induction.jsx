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
    <div style={{ margin: "10px", display: "flex", flexDirection: "row" }}>
      <Images {...activityData.config} />
      <Rules
        style={{ padding: "20px" }}
        generateNewPics={e => {
          formSubmitEvent.preventDefault();

          console.log("You have selected:", this.state.value);
        }}
        {...activityData.config}
      />
    </div>
  </div>;
