#include "./include/utils.h"

processorDef noiseDef;

EM_BOOL GenerateNoise(int numInputs, const AudioSampleFrame *inputs,
                      int numOutputs, AudioSampleFrame *outputs,
                      int numParams, const AudioParamFrame *params,
                      void *userData)
{
  for (int i = 0; i < numOutputs; ++i)
    for (int j = 0; j < 128 * outputs[i].numberOfChannels; ++j)
      outputs[i].data[j] = emscripten_random() * 0.2 - 0.1; // Warning: scale down audio volume by factor of 0.2, raw noise can be really loud otherwise

  return EM_TRUE; // Keep the graph output going
}

// PROCESSOR FUNC GETTER
AudioProcessorFunc NoiseGetProcessorFunc()
{
  return &GenerateNoise;
}

// PROCESSOR OPTIONS GETTER
EmscriptenAudioWorkletNodeCreateOptions NoiseGetWorkletOptions()
{
  EmscriptenAudioWorkletNodeCreateOptions options;
  int *outputChannelCounts = (int *)malloc(sizeof(int));
  outputChannelCounts[0] = 1;

  options = {
      .numberOfInputs = 0,
      .numberOfOutputs = 1,
      .outputChannelCounts = outputChannelCounts};

  return options;
}

processorDef *get_noise_proc()
{
  noiseDef.processorOptsGetter = NoiseGetWorkletOptions;
  noiseDef.processorFuncGetter = NoiseGetProcessorFunc;

  return &noiseDef;
}