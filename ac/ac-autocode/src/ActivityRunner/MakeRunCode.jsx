// @flow

const makeRunCode = (language: string) => {
  switch (language) {
    case 'python':
      return python();
    case 'javascript':
    default:
      return javascript();
  }
};

const javascript = () => {
  // print is the function used in the code to provide output
  /* eslint no-unused-vars: ["error", { "argsIgnorePattern": "print" }] */
  const javascriptRunCode = (code: string, print: Function) =>
    new Promise((resolve, reject) => {
      try {
        /* eslint no-eval: "off" */
        eval(code);
      } catch (e) {
        reject(e);
      }
      resolve();
    });

  const javascriptHandleError = (err: Object) => err.name + ': ' + err.message;

  return { runCode: javascriptRunCode, handleError: javascriptHandleError };
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

  const pythonRunCode = (code: string, out: Function) => {
    if (window.Sk) {
      window.Sk.configure({ output: out, read: builtinRead });
      return window.Sk.misceval.asyncToPromise(() => {
        window.Sk.importMainWithBody('<stdin>', false, code);
      });
    }
  };

  const pythonHandleError = (err: Object, offset: number) => {
    const t = err.traceback;
    const a = err.args;
    const lineno = t && t[0] && t[0].lineno - offset;
    const message = a && a.v && a.v[0] && a.v[0].v;
    const error = lineno
      ? 'On line ' + lineno + ', Received error: ' + message
      : 'Received error: ' + message;
    return error;
  };

  return { runCode: pythonRunCode, handleError: pythonHandleError };
};

export default makeRunCode;
