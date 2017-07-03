// @flow

import { type ActivityPackageT } from "frog-utils";

import ActivityRunner from "./Induction";
import config from "./config";

const meta = {
  name: "Induction",
  type: "react-component"
};

export default ({
  id: "ac-induction",
  meta,
  config,
  ActivityRunner,
  Dashboard: null
}: ActivityPackageT);
