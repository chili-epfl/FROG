import * as React from "react";
import { storiesOf } from "@storybook/react";
import { SigninCard } from ".";

const onSignEnter = (email, password) => {
  console.log(`Sign in using email: ${email} and password: ${password}`);
};

const onForgotPassword = () => {
  console.log(`Forgot Password`);
};

const onCreateAccount = () => {
  console.log(`Create New Account`);
};

const closeSignin = () => {
  console.log(`Closed`);
};

storiesOf("Frog Landing Page/Sign In Card", module).add("Simple", () => (
  <SigninCard
    onSignEnter={onSignEnter}
    onForgotPassword={onForgotPassword}
    onCreateAccount={onCreateAccount}
    closeSignin={closeSignin}
  />
));
