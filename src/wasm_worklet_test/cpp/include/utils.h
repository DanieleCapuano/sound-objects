#ifndef __UTILS__
#define __UTILS__

#include <emscripten/webaudio.h>
#include <emscripten/em_math.h>

using namespace std;

uint8_t audioThreadStack[4096];

// processors interface composed of the AudioProcessorFunc, a FuncGetter and OptionsGetter
typedef EM_BOOL (*AudioProcessorFunc)(int, const AudioSampleFrame *,
                                      int, AudioSampleFrame *,
                                      int, const AudioParamFrame *,
                                      void *);
typedef AudioProcessorFunc (*AudioProcessorFuncGetter)();
typedef EmscriptenAudioWorkletNodeCreateOptions *(*AudioProcessorOptionsGetter)();

// each actual processor will define a processorDef struct with its own getter functions
struct processorDef
{
    char *name;
    AudioProcessorFuncGetter processorFuncGetter;
    AudioProcessorOptionsGetter processorOptsGetter;
};
typedef struct processorDef processorDef;

///////////////////////////////
//<NOISE PROCESSOR DEF>
processorDef noiseDef;
noiseDef.name = "noise-generator";
noiseDef.processorFuncGetter = NoiseGetProcessorFunc;
noiseDef.processorOptsGetter = NoiseGetWorkletOptions;
//</NOISE PROCESSOR DEF>
///////////////////////////////

// all available processors will be listed in the "processors" map
map<string, processorDef> processors;
processors[noiseDef.name] = noiseDef;

#endif