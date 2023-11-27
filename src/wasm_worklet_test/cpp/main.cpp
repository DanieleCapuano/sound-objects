#include "./include/utils.h"

EMSCRIPTEN_WEBAUDIO_T context;

EM_JS(void, sendAudioContextToUI, (EMSCRIPTEN_WEBAUDIO_T audioContext), {
  audioContext = emscriptenGetAudioObject(audioContext);
  window.setContext(audioContext);
});

EM_JS(void, sendWorkletToUI, (char *wname, EMSCRIPTEN_AUDIO_WORKLET_NODE_T audioWorklet), {
  audioWorklet = emscriptenGetAudioObject(audioWorklet);
  window.setWorklet(wname, audioWorklet);
});

void AudioWorkletProcessorCreated(EMSCRIPTEN_WEBAUDIO_T audioContext, EM_BOOL success, void *userData)
{
  char *wname = (char *)userData;
  string wname_str = wname;
  processorDef proc = processors[wname_str];
  EmscriptenAudioWorkletNodeCreateOptions *options = proc.processorOptsGetter();
  AudioProcessorFunc processorFunc = proc.processorFuncGetter();

  // Create node
  EMSCRIPTEN_AUDIO_WORKLET_NODE_T wasmAudioWorklet = emscripten_create_wasm_audio_worklet_node(audioContext,
                                                                                               wname, options, *processorFunc, 0);

  sendWorkletToUI(wname, wasmAudioWorklet);
}

void AudioThreadInitialized(EMSCRIPTEN_WEBAUDIO_T audioContext, EM_BOOL success, void *userData)
{
  if (!success)
    return; // Check browser console in a debug build for detailed errors

  char *wname = (char *)userData;
  WebAudioWorkletProcessorCreateOptions opts = {
      .name = wname,
  };
  emscripten_create_wasm_audio_worklet_processor_async(audioContext, &opts, &AudioWorkletProcessorCreated, userData);
}

extern "C" void initWorklet(char *name)
{
  emscripten_start_wasm_audio_worklet_thread_async(context, audioThreadStack, sizeof(audioThreadStack),
                                                   &AudioThreadInitialized, (void *)name);
}

int main()
{
  context = emscripten_create_audio_context(0);
  sendAudioContextToUI(context);
}