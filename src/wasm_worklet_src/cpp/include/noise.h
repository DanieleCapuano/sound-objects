#ifndef __NOISE_H__
#define __NOISE_H__

#include "./utils.h"

EM_BOOL GenerateNoise(int numInputs, const AudioSampleFrame *inputs,
                      int numOutputs, AudioSampleFrame *outputs,
                      int numParams, const AudioParamFrame *params,
                      void *userData);

AudioProcessorFunc NoiseGetProcessorFunc();
EmscriptenAudioWorkletNodeCreateOptions *NoiseGetWorkletOptions();
processorDef *get_noise_proc();

#endif