// @ flow

export const Meteor = {
  error: (message, key) => {
    throw {
      type: 'fakeMeteor.error',
      message,
      key
    };
  },
  methods: () => undefined
};

export const Mongo = {
  Collection: () => undefined
};

export const createContainer = () => undefined;
