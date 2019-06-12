//@flow

/***
 * This file define a primary button (displayed horizontally in the
 * Navbar).
 */

import * as React from 'react';

type PrimaryButtonPropsT = {
  title: string,
  active?: boolean,
  icon?: React.ComponentType<*>,
  callback?: () => void
};

export default (props: PrimaryButtonPropsT) => {
  const { active, title, icon, callback } = props;

  const Icon = icon;

  return (
    <div
      style={{
        display: 'flex',
        flex: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        cursor: callback && 'pointer',
        padding: '20px 0'
      }}
      onClick={callback}
    >
      {Icon !== undefined ? (
        <Icon
          style={{ marginRight: '5px' }}
          color={active ? 'secondary' : 'primary'}
        />
      ) : null}
      <span>{title}</span>
    </div>
  );
};
