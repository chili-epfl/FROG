// @flow

export const Scenario = (description: string, procedure: () => void) => {
  describe(`Scenario: ${description}`, procedure);
};

export const Given = (description: string, procedure: () => void) => {
  it(`Given: ${description}`, procedure);
};

export const When = (description: string, procedure: () => void) => {
  it(`When: ${description}`, procedure);
};

export const Then = (description: string, procedure: () => void) => {
  it(`Then: ${description}`, procedure);
};
