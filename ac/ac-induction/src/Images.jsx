// @flow

import React from "react";
//import { View, Image } from "react-native";

const Images = props => {
  if (!props.imgTrue || !props.imgFalse) {
    return <div>{"Images's URI not found"}</div>;
  } else {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <img style={{}} src={props.imgTrue} alt={""} />
        <br /><br />
        <img style={{}} src={props.imgFalse} alt={""} />
      </div>
    );
  }
};

export default Images;
//style={{ width: 50, height: 50 }}
