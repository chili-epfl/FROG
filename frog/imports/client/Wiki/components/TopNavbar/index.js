//@flow

/***
 * This file implements the top-level component for the navbar. The navbar is
 * responsible for displaying wiki page controls such as full or splitview,
 * page revisions, page delete button, and the current user.
 */

import * as React from 'react';

import PrimaryButton from './PrimaryButton';
import SecondaryPanel from './SecondaryPanel';

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

export default (props: TopNavBarPropsT) => {
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
      <PrimaryButton key="user" title={user} />
      <SecondaryPanel {...props} />
    </div>
  );
};
