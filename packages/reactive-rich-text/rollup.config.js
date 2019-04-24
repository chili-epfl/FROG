import babel from 'rollup-plugin-babel';

// list of plugins used during building process
const plugins = () => [
  babel({
    exclude: 'node_modules/**'
  })
];

export default [
  {
    // source file / entrypoint
    input: 'src/main.js',
    // output configuration
    plugins: plugins(),
    output: {
      // name visible for other scripts
      name: 'reactive-rich-text',
      // output file location
      file: 'dist/main.esm.js',
      // format of generated JS file, also: esm, and others are available
      format: 'esm',
      // add sourcemaps
      sourcemap: true
    }
  }
];
