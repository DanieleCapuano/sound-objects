#!/bin/bash

emcc cpp/main.cpp cpp cpp/noise.cpp -sAUDIO_WORKLET=1 -sWASM_WORKERS=1 -O3 -s EXPORTED_FUNCTIONS=["_initWorklet"]  -s EXPORTED_RUNTIME_METHODS=["cwrap","setValue","emscriptenRegisterAudioObject"] -o ./em_random_gen.js