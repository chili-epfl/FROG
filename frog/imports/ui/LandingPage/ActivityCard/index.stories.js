import * as React from "react";
import { storiesOf } from "@storybook/react";
import { ActivityCard } from ".";

const container = {
  display: "flex",
  justifyContent: "center",
  background: "#246FFF",
  padding: "20px 0px",
  width: "100%"
};

storiesOf("Frog Landing Page/Activity Card", module).add("Simple", () => (
  <div style={container}>
    <ActivityCard
      imageURL="https://picsum.photos/100"
      title="Activity Card Title"
    />
  </div>
));
