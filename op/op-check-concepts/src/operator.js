const mapData = (aD, fn) => {
  const payload = aD.payload;
  const newPayload = Object.keys(payload).reduce(
    (acc, instance) => ({ ...acc, [instance]: fn(payload[instance]) }),
    {}
  );
  return { ...aD, payload: newPayload };
};

const getPrompt = (configData, item) => {
  const prompts = [];
  configData.concepts.forEach(concept => {
    if (
      !concept.keyword
        .split(',')
        .map(y => y.trim())
        .some(word => item.text.includes(word))
    ) {
      prompts.push(concept.prompt);
    }
  });
  return prompts.join('\n');
};

const operator = (configData, object) => {
  const { activityData } = object;
  return mapData(activityData, item => ({
    ...item,
    config: { prompt: getPrompt(configData, item.data) }
  }));
};

export default operator;
