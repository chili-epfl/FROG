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
  <div
    style={{
      overflow: "hidden",
      position: "relative",
      width: "100%",
      height: "100%"
    }}
  >
    <h4 style={{ marginLeft: "20px" }}>{activityData.config.title}</h4>
    <div
      style={{
        margin: "10px",
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "row"
      }}
    >
      <Images
        style={{
          height: "100%",
          width: "50%"
        }}
        {...activityData.config}
      />
      <Rules
        style={{
          position: "relative",
          margin: "20px",
          height: "100%",
          width: "50%"
        }}
        generateNewPics={(arr, e) => {
          e.preventDefault();
          //console.log("You have selected:" + arr);
        }}
        {...activityData.config}
      />
    </div>
  </div>;
