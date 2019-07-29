// @flow

import * as React from 'react';

import { Chip, Avatar } from '@material-ui/core';
import AccountModal from '/imports/client/AccountModal/AccountModal';
import { useModal } from '/imports/ui/Modal';
import PrimaryButton from './PrimaryButton';
import OverflowPanel from './OverflowPanel';

type TopNavBarPropsT = {
  username: string,
  // Status of the user, username will be displayed in italics if true
  isAnonymous: boolean,
  changeUsername: Function,
  // List of buttons to display in the primary view
  primaryNavItems: Array<{
    active?: boolean,
    title: string,
    icon: React.ComponentType<*>,
    callback?: () => void
  }>,

  // List of buttons to display in the secondary view (dropdown)
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
  const { username, isAnonymous, primaryNavItems, secondaryNavItems } = props;
  const [showModal] = useModal();
  /* eslint-disable no-unused-expressions */
  const displayModal = () => {
    isAnonymous ? showModal(<AccountModal formToDisplay="signup" />) : null;
  };

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
      <PrimaryButton style={isAnonymous ? { fontStyle: 'italic' } : {}}>
        <Chip
          avatar={<Avatar>{username.charAt(0)}</Avatar>}
          label={username}
          onClick={displayModal}
        />
      </PrimaryButton>
      <OverflowPanel overflowElements={secondaryNavItems} />
    </div>
  );
};

export default TopNavbar;
