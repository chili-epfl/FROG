// @flow

import React from "react";

const Images = (props: { imgTrue: String, imgFalse: String }) => {
  if (!props.imgTrue || !props.imgFalse) {
    return <div>{"Images's URI not found"}</div>;
  } else {
    return (
      <div
        style={{
          height: "100%",
          width: "50%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "45%"
          }}
        >
          <div
            style={{
              width: "5%",
              height: "100%",
              background: "green"
            }}
          />
          <img
            style={{
              width: "90%",
              height: "95%",
              margin: "auto"
            }}
            src={props.imgTrue}
            alt={""}
          />
        </div>
        <br />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "45%"
          }}
        >
          <div
            style={{
              width: "5%",
              height: "100%",
              background: "red"
            }}
          />
          <img
            style={{
              width: "90%",
              height: "95%",
              margin: "auto"
            }}
            src={props.imgFalse}
            alt={""}
          />
        </div>
      </div>
    );
  }
};

export default Images;
