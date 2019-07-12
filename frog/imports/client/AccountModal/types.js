// @flow

export type FormError = {
  displayName: string,
  email: string,
  password: string
};

export type SignUpStateT = {
  displayName: string,
  email: string,
  password: string,
  formErrors: FormError
};

export type SignUpPropsT = {
  classes: Object
};
