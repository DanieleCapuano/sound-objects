#!/bin/bash

emcc cpp/em_random_gen.cpp -sAUDIO_WORKLET=1 -sWASM_WORKERS=1 -O3 -s EXPORTED_RUNTIME_METHODS=["cwrap","setValue","emscriptenRegisterAudioObject"] -o ./em_random_gen.js