var fs = require('fs');

//this is a workaround fix to prevent the following well-known bug 
//for which we cannot place worklet files in non-root folders:
//https://github.com/emscripten-core/emscripten/issues/20316

const wasmJSFilePath = '../../wasm-worklet/wasm_worklets.js';
let wasmJSStr = fs.readFileSync(wasmJSFilePath, 'utf-8');

console.log("Fixing wasm_worklets.js...");

fs.writeFileSync(
    wasmJSFilePath,
    wasmJSStr.replace('"wasm_worklets.aw.js"', 'locateFile("wasm_worklets.aw.js")')
);

console.log("All done.");