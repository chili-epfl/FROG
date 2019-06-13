//@flow

import * as React from 'react';

import PrimaryButton from './PrimaryButton';
import OverflowPanel from './OverflowPanel';

type TopNavBarPropsT = {
  /** The current Meteor username */
  user: string,

  /** List of buttons to display in the primary view */
  primaryNavItems: Array<{
    active?: boolean,
    title: string,
    icon: React.ComponentType<*>,
    callback?: () => void
  }>,

  /** List of buttons to display in the secondary view (dropdown)*/
  secondaryNavItems: Array<{
    title: string,
    icon: React.ComponentType<*>,
    callback?: () => void
  }>
};

/**
 * The navbar is responsible for displaying wiki page controls.
 * Controls can be primary (displayed horizontally), or secondary (displayed in a dropdown).
 */
const TopNavbar = (props: TopNavBarPropsT) => {
  const { user, primaryNavItems, secondaryNavItems } = props;

  return (
    <div
      style={{
        display: 'flex',
        height: '50px',
        backgroundColor: 'white',
        borderBottom: '1px lightgrey solid'
      }}
    >
      {primaryNavItems.map((item, index) => (
        <PrimaryButton key={index} {...item} />
      ))}
      <PrimaryButton key="username" title={user} />
      <OverflowPanel overflowElements={secondaryNavItems} />
    </div>
  );
};

export default TopNavbar;
