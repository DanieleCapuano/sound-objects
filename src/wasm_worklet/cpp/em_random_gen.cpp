#include <emscripten/webaudio.h>
#include <emscripten/em_math.h>

uint8_t audioThreadStack[4096];

EM_BOOL GenerateNoise(int numInputs, const AudioSampleFrame *inputs,
                      int numOutputs, AudioSampleFrame *outputs,
                      int numParams, const AudioParamFrame *params,
                      void *userData)
{
  for(int i = 0; i < numOutputs; ++i)
    for(int j = 0; j < 128*outputs[i].numberOfChannels; ++j)
      outputs[i].data[j] = emscripten_random() * 0.2 - 0.1; // Warning: scale down audio volume by factor of 0.2, raw noise can be really loud otherwise

  return EM_TRUE; // Keep the graph output going
}

EM_JS(void, sendDataToUI, (EMSCRIPTEN_WEBAUDIO_T audioContext, EMSCRIPTEN_AUDIO_WORKLET_NODE_T audioWorkletNode), {
  audioContext = emscriptenGetAudioObject(audioContext);
  audioWorkletNode = emscriptenGetAudioObject(audioWorkletNode);
  window.setWorklet(audioContext, audioWorkletNode);
});

void AudioWorkletProcessorCreated(EMSCRIPTEN_WEBAUDIO_T audioContext, EM_BOOL success, void *userData)
{
  if (!success) return; // Check browser console in a debug build for detailed errors

  int outputChannelCounts[1] = { 1 };
  EmscriptenAudioWorkletNodeCreateOptions options = {
    .numberOfInputs = 0,
    .numberOfOutputs = 1,
    .outputChannelCounts = outputChannelCounts
  };

  // Create node
  EMSCRIPTEN_AUDIO_WORKLET_NODE_T wasmAudioWorklet = emscripten_create_wasm_audio_worklet_node(audioContext,
                                                            "noise-generator", &options, &GenerateNoise, 0);

  sendDataToUI(audioContext, wasmAudioWorklet);
}

void AudioThreadInitialized(EMSCRIPTEN_WEBAUDIO_T audioContext, EM_BOOL success, void *userData)
{
  if (!success) return; // Check browser console in a debug build for detailed errors

  WebAudioWorkletProcessorCreateOptions opts = {
    .name = "noise-generator",
  };
  emscripten_create_wasm_audio_worklet_processor_async(audioContext, &opts, &AudioWorkletProcessorCreated, 0);
}

int main()
{
  EMSCRIPTEN_WEBAUDIO_T context = emscripten_create_audio_context(0);

  emscripten_start_wasm_audio_worklet_thread_async(context, audioThreadStack, sizeof(audioThreadStack),
                                                   &AudioThreadInitialized, 0);
}