#ifndef __UTILS_H__
#define __UTILS_H__

#include <string>
#include <iostream>
#include <map>
#include <emscripten/webaudio.h>
#include <emscripten/em_math.h>

using namespace std;

typedef EM_BOOL (*AudioProcessorFunc)(int, const AudioSampleFrame *,
                                      int, AudioSampleFrame *,
                                      int, const AudioParamFrame *,
                                      void *);
typedef AudioProcessorFunc (*AudioProcessorFuncGetter)();
typedef EmscriptenAudioWorkletNodeCreateOptions *(*AudioProcessorOptionsGetter)();

typedef struct pDef
{
    AudioProcessorFuncGetter processorFuncGetter;
    AudioProcessorOptionsGetter processorOptsGetter;
} pDef;
typedef pDef processorDef;
typedef map<string, processorDef *> processorsMap;

#endif