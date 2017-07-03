// @flow

import React from "react";

const Rules = ({ goodDef, falseDef }) =>
  <form onSubmit={() => {}}>
    <input type="radio" value="option1" checked text={goodDef} />
    {falseDef.map(d => <input type="radio" value={d} text={d} />)}
  </form>;

export default Rules;
