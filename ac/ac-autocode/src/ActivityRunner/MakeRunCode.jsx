// @flow

const makeRunCode = (language: string) => {
  console.log(language);
  switch (language) {
    case 'python':
      return python();
    case 'javascript':
      return javascript();
    default:
      return python();
  }
};

const javascript = () => {
  const javascriptRunCode = (code: string, out: Function, err: Function) => {
    return new Promise((resolve, reject) => {
      try {
        const consoleToOut =
          'const print = (...args) => args.forEach(output => out(output));\n';
        console.log(consoleToOut + code);
        eval(consoleToOut + code);
      } catch (e) {
        out(String(e));
        reject();
      }
      resolve();
    });
  };

  return javascriptRunCode;
};

const python = () => {
  const script = document.createElement('script');
  script.src = 'http://www.skulpt.org/static/skulpt.min.js';
  script.async = false;
  if (document.body != null) {
    document.body.appendChild(script);
  }

  const script2 = document.createElement('script');
  script2.src = 'http://www.skulpt.org/static/skulpt-stdlib.js';
  script2.async = false;
  if (document.body != null) {
    document.body.appendChild(script2);
  }

  const builtinRead = (x: string) => {
    if (
      window.Sk.builtinFiles === undefined ||
      window.Sk.builtinFiles['files'][x] === undefined
    )
      throw "File not found: '" + x + "'";
    return window.Sk.builtinFiles['files'][x];
  };

  const pythonRunCode = (code: string, out: Function, err: Function) => {
    if (window.Sk) {
      window.Sk.configure({ output: out, read: builtinRead });
      return window.Sk.misceval.asyncToPromise(() => {
        window.Sk.importMainWithBody('<stdin>', false, code);
      });
    } else {
      err('Skulpt not loaded, please check internet connection');
    }
  };

  return pythonRunCode;
};

export default makeRunCode;
