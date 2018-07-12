// @flow

type version1 = {
  concepts: { [string]: { keyword: string[], prompt: string } }
};

type version2 = {
  concepts: { keyword: string[], prompt: string }[]
};

const upgr2: version1 => version2 = formData => ({
  concepts: Object.keys(formData.concepts).map(x => ({
    keyword: formData.concepts[x].keyword,
    prompt: formData.concepts[x].prompt
  }))
});

type version3 = {
  concepts: { keyword: string, prompt: string }[]
};

const upgr3: version2 => version3 = formData => ({
  concepts: formData.concepts.map(x => ({
    keyword: x.keyword.reduce(
      (acc, cur, i) => (i === 0 ? cur : acc + ', ' + cur),
      ''
    ),
    prompt: x.prompt
  }))
});

export default { '2': upgr2, '3': upgr3 };
