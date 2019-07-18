// @flow

const javascript = () => {
  const javascriptRunCode = (code: string, print: Function) => {
    const prom: Promise<any> = new Promise((resolve, reject) => {
      // Pipe console.log to postMessage
      const environment =
        'let console = {log: function(){let str = "";for(let i = 0; i < arguments.length; i++){str += JSON.stringify(arguments[i])+" ";}str += "\\n";self.postMessage(str)}};';

      const fullCode = environment + code + '\nself.postMessage("FINISHED")';

      // prepare the string into an executable blob
      const bb = new Blob([fullCode], {
        type: 'text/javascript'
      });

      // convert the blob into a pseudo URL
      const bbURL = URL.createObjectURL(bb);

      // Prepare the worker to run the code
      let worker = new Worker(bbURL);

      // add a listener for messages from the Worker
      worker.addEventListener('message', (e: Object) => {
        if (e.data) {
          if (e.data === 'FINISHED' && worker) {
            worker.terminate();
            worker = null;
            resolve();
          } else {
            print(e.data);
          }
        }
      });

      // add a listener for errors from the Worker
      worker.addEventListener('error', (e: Object) => reject(e));

      worker.postMessage('start');

      // Put a timeout to automatically kill the worker
      setTimeout(() => {
        if (worker) {
          worker.terminate();
          reject(new Error('code execution timeout'));
          worker = null;
        }
      }, 5000);
    });
    return prom;
  };

  const javascriptHandleError = (err: Object) => err.message;

  return { runCode: javascriptRunCode, handleError: javascriptHandleError };
};

export default javascript;
