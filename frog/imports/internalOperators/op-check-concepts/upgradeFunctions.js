// @flow

type version01 = {
  concepts: { [string]: { keyword: string[], prompt: string } }
};

type version02 = {
  concepts: { keyword: string[], prompt: string }[]
};

const upgr0: version01 => version02 = formData => ({
  concepts: Object.keys(formData.concepts).map(x => ({
    keyword: formData.concepts[x].keyword,
    prompt: formData.concepts[x].prompt
  }))
});

type version1 = {
  concepts: { keyword: string, prompt: string }[]
};

const upgr1: version02 => version1 = formData => ({
  concepts: formData.concepts.map(x => ({
    keyword: x.keyword.reduce(
      (acc, cur, i) => (i === 0 ? cur : acc + ', ' + cur),
      ''
    ),
    prompt: x.prompt
  }))
});

export default { '0': upgr0, '1': upgr1 };
