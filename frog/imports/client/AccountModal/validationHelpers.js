// @flow
export const errorBasedOnChars = (
  value: string,
  numberOfChars: number,
  type: string
) => {
  return value.length < numberOfChars
    ? `${type} has to have a minimum of ${numberOfChars} characters`
    : '';
};

export const emailErrors = (email: string) => {
  const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );
  if (email.length === 0)
    return 'This field is required, please enter an email address';
  return emailRegex.test(email) ? '' : 'invalid email address';
};
export const passwordErrors = (password: string) => {
  return errorBasedOnChars(password, 5, 'password');
};