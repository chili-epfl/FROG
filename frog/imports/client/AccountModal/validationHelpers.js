// @flow
export const errorBasedOnChars = (
  value: string,
  x: number,
  type: string
): string => {
  return value.length < x
    ? `${type} has to have a minimum of ${x} characters`
    : '';
};

export const emailErrors = (email: string): string => {
  const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );
  if (email.length === 0)
    return 'This field is required, please enter an email address';
  return emailRegex.test(email) ? '' : 'invalid email address';
};
export const passwordErrors = (password: string): string => {
  return errorBasedOnChars(password, 5, 'password');
};
