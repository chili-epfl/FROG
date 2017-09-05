// @ flow

export const Meteor = {
  error: (message, key) => {
    throw {
      type: 'fakeMeteor.error',
      message,
      key
    };
  }
};
