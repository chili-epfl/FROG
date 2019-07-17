// @flow

import * as React from 'react';

type ButtonPropsT = {
  title: string
};

export const Button = (props: ButtonPropsT) => <div>{props.title}</div>;
