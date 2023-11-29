#include "./include/utils.h"
#include "./include/lib.h"

uint8_t audioThreadStack[4096];
EMSCRIPTEN_WEBAUDIO_T context;

EM_JS(void, sendAudioContextToUI, (EMSCRIPTEN_WEBAUDIO_T audioContext), {
  audioContext = emscriptenGetAudioObject(audioContext);
  window.setContext(audioContext);
});

EM_JS(void, sendWorkletToUI, (const char *wname, const int slen, EMSCRIPTEN_AUDIO_WORKLET_NODE_T audioWorklet), {
  audioWorklet = emscriptenGetAudioObject(audioWorklet);
  window.setWorklet(UTF8ToString(wname, slen), audioWorklet);
});

void AudioWorkletProcessorCreated(EMSCRIPTEN_WEBAUDIO_T audioContext, EM_BOOL success, void *userData)
{
  char *wname = (char *)userData;
  string wname_str = wname;

  processorDef *proc = get_processor_by_name(wname_str);
  EmscriptenAudioWorkletNodeCreateOptions options = proc->processorOptsGetter();
  AudioProcessorFunc processorFunc = proc->processorFuncGetter();

  // Create node
  EMSCRIPTEN_AUDIO_WORKLET_NODE_T wasmAudioWorklet = emscripten_create_wasm_audio_worklet_node(audioContext,
                                                                                               wname, &options, *processorFunc, 0);

  sendWorkletToUI((const char *)wname, (const int)wname_str.length(), wasmAudioWorklet);
}

void AudioThreadInitialized(EMSCRIPTEN_WEBAUDIO_T audioContext, EM_BOOL success, void *userData)
{
  if (!success)
    return; // Check browser console in a debug build for detailed errors

  char *wname = (char *)userData;
  cout << "Init done for " << wname << endl;

  WebAudioWorkletProcessorCreateOptions opts = {
      .name = wname,
  };
  emscripten_create_wasm_audio_worklet_processor_async(audioContext, &opts, &AudioWorkletProcessorCreated, userData);
}

extern "C" void initWorklet(const char *name)
{
  string s = name;
  const int length = s.length();
  char *char_array = new char[length + 1];
  strcpy(char_array, s.c_str());

  cout << "Doing init for processor: " << char_array << endl;

  emscripten_start_wasm_audio_worklet_thread_async(context, audioThreadStack, sizeof(audioThreadStack),
                                                   &AudioThreadInitialized, (void *)char_array);
}

extern "C" void initContext()
{
  init_processors();
  context = emscripten_create_audio_context(0);
  sendAudioContextToUI(context);
}
