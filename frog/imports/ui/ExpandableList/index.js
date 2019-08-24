// @flow

import * as React from 'react';
import { ArrowDropDown, ArrowRight } from '@material-ui/icons';

import { RowButton } from '/imports/ui/RowItems';

type ExpandableListPropsT = {
  title: string,
  expanded?: boolean,
  children: React.Element<*> | React.Element<*>[]
};

export const ExpandableList = (props: ExpandableListPropsT) => {
  const [active, setActive] = React.useState(props.expanded || false);

  return (
    <div>
      <RowButton
        icon={
          active ? (
            <ArrowDropDown fontSize="small" />
          ) : (
            <ArrowRight fontSize="small" />
          )
        }
        onClick={() => {
          setActive(!active);
        }}
      >
        {props.title}
      </RowButton>
      {active && props.children}
    </div>
  );
};
