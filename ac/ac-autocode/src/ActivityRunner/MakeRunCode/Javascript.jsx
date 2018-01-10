// @flow

const javascript = () => {
  const javascriptRunCode = (code: string, print: Function) =>
    new Promise((resolve, reject) => {
      //Define console.log
      const environment =
        'let console = {log: function(){let str = "";for(let i = 0; i < arguments.length; i++){str += JSON.stringify(arguments[i])+" ";}str += "\\n";self.postMessage(str);}};';

      const fullCode = environment + code;
      console.log(fullCode);
      // prepare the string into an executable blob
      const bb = new Blob([code], {
        type: 'text/javascript'
      });

      // convert the blob into a pseudo URL
      const bbURL = URL.createObjectURL(bb);

      // Prepare the worker to run the code
      let worker = new Worker(bbURL);

      // add a listener for messages from the Worker
      worker.addEventListener('message', e => {
        console.log(e);
        if (e.data) {
          print(e.data);
        }
        resolve();
      });

      // add a listener for errors from the Worker
      worker.addEventListener('error', (e: Object) => reject(e));

      console.log('start');
      worker.postMessage('start');

      // Put a timeout to automatically kill the worker
      setTimeout(function() {
        if (worker) {
          worker.terminate();
        }
        reject(new Error('code execution timeout'));
        worker = null;
      }, 5000);
    });

  const javascriptHandleError = (err: Object) => err.name + ': ' + err.message;

  return { runCode: javascriptRunCode, handleError: javascriptHandleError };
};

export default javascript;
