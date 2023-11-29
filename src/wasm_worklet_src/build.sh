#!/bin/bash

emcc cpp/noise.cpp cpp/lib.cpp cpp/main.cpp -sAUDIO_WORKLET=1 -sWASM_WORKERS=1 -O3 -s EXPORTED_FUNCTIONS=["_initWorklet, _initContext"] -s EXPORTED_RUNTIME_METHODS=["cwrap","setValue","emscriptenRegisterAudioObject"] -o ../../wasm-worklet/wasm_worklets.js && node ./fix-aw-locate.js
# emcc cpp/noise.cpp cpp/lib.cpp cpp/main.cpp -sAUDIO_WORKLET=1 -sWASM_WORKERS=1 -O3 -s EXPORTED_FUNCTIONS=["_initWorklet, _initContext"] -s EXPORTED_RUNTIME_METHODS=["cwrap","setValue","emscriptenRegisterAudioObject"] -o ../../wasm-worklet/wasm_worklets.js

#debug build
#emcc cpp/noise.cpp cpp/lib.cpp cpp/main.cpp -sAUDIO_WORKLET=1 -sWASM_WORKERS=1 -g -s EXPORTED_FUNCTIONS=["_initWorklet, _initContext"] -s EXPORTED_RUNTIME_METHODS=["cwrap","setValue","emscriptenRegisterAudioObject"] -o ../../wasm-worklet/wasm_workets.js