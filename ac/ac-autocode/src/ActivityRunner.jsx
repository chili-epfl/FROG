// @flow

import React from 'react';
import type { ActivityRunnerT } from 'frog-utils';



const ActivityRunner = ({ activityData }: ActivityRunnerT) => {


  const outf = (text) => {
    let codeOutput = document.getElementById("codeOutput");
    codeOutput.innerHTML = text;
  };

  return (
    <div>

<script src="http://www.skulpt.org/static/skulpt.min.js" type="text/javascript"></script>
<script src="http://www.skulpt.org/static/skulpt-stdlib.js" type="text/javascript"></script>

<script type="text/javascript">


function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
            throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}

function runit() {
   var prog = document.getElementById("yourcode").value;
   out= document.getElementById("output");
   out.innerHTML=""
   Sk.configure({output:(text)=>{out.innerHTML=out.innerHTML+text}, read:builtinRead});
  Sk.importMainWithBody("<stdin>",false,prog);
}
</script>

<h3>Try This</h3>
<textarea id="yourcode" cols="40" rows="10">
print "Hello World"
</textarea>
<button type="button" onclick="runit()">Run</button>
<p id="output" ></p>
</body>
</div>
  );
};

export default ActivityRunner;
