#include "./include/utils.h"
#include "./include/lib.h"
#include "./include/noise.h"

processorsMap processors;

void init_processors()
{
    processors["noise-generator"] = get_noise_proc();
}

processorsMap *get_processors()
{
    return &processors;
}

processorDef *get_processor_by_name(string name)
{
    return processors[name];
}