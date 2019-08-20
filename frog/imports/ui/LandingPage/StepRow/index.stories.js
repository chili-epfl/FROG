import * as React from "react";
import { storiesOf } from "@storybook/react";
import { StepRow } from ".";

storiesOf("Frog Landing Page/Step Row", module).add("Simple", () => (
  <StepRow
    imageURL="https://picsum.photos/200"
    title="Create your class schedule"
  >
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat.
  </StepRow>
));

storiesOf("Frog Landing Page/Step Row", module).add("Reverse", () => (
  <StepRow
    imageURL="https://picsum.photos/200"
    title="Create your class schedule"
    variant="reverse"
  >
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat.
  </StepRow>
));
