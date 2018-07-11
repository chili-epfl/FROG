// @flow

type version1 = {
  concepts: { [number]: { keyword: [string], prompt: string } }
};

type version2 = {
  concepts: [{ keyword: [string], prompt: string }]
};

const upgr2: version1 => version2 = formData => ({
  concepts: Object.values(formData.concepts)
});

type version3 = {
  concepts: [{ keyword: string, prompt: string }]
};

const upgr3: version2 => version3 = formData => {
  const newData = { concepts: [] };
  formData.concepts.forEach(x =>
    newData.concepts.push({
      keyword: x.keyword.reduce(
        (acc, cur, i) => (i === 0 ? cur : acc + ', ' + cur),
        ''
      ),
      prompt: x.prompt
    })
  );
  return newData;
};

export default { '2': upgr2, '3': upgr3 };
