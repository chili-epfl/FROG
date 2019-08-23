import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { SigninCard } from '.';

const onSignEnter = (email, password) => {
  console.info(`Sign in using email: ${email} and password: ${password}`);
};

const onForgotPassword = () => {
  console.info(`Forgot Password`);
};

const onCreateAccount = () => {
  console.info(`Create New Account`);
};

const closeSignin = () => {
  console.info(`Closed`);
};

storiesOf('Frog Landing Page/Sign In Card', module).add('Simple', () => (
  <SigninCard
    onSignEnter={onSignEnter}
    onForgotPassword={onForgotPassword}
    onCreateAccount={onCreateAccount}
    closeSignin={closeSignin}
  />
));
