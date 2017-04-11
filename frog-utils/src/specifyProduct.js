const isObject = function(a) {
  return !!a && a.constructor === Object;
};

const extractValue = (item, socialAttributes) => {
  if (isObject(item)) {
    const groupType = Object.keys(item)[0];
    if (socialAttributes[groupType]) {
      return item[groupType][socialAttributes[groupType]] ||
        item[groupType].default;
    }
    return undefined;
  }
  return item;
};

export default (product, socialStructure) => {
  const socialAttributes = socialStructure[Object.keys(socialStructure)[0]];
  return Object.keys(product).map(x =>
    extractValue(product[x], socialAttributes));
};

// -----------------------------------------------

// Given the following product
// const x = {
//   age: 21,
//   name: { role: { junior: 'stian', senior: 'blue' } },
//   url: { group: { red: 'https://google.com', blue: 'https://yahoo.com' } },
//   secret: { role: { carpenter: true, default: 'false' } }
// };

// and the following social structure
// const socialStructure = { stian: { group: 'red', role: 'junior' } };

// returns the following "specified product"
// 21, "stian", "https://google.com", "false"
