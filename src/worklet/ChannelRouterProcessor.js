//AUDIO WORKLET PROCESSOR for Channel Router
//start code from
//https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor/process

//Channel Router Processor: this simply sends different inputs to different channels of a single output
class ChannelRouterProcessor extends AudioWorkletProcessor {
    running = true;

    constructor(...args) {
        super(...args);
        this.port.onmessage = (e) => {
            this.running = e.data;
        };
    };

    process(inputs, outputs) {
        // take the first output
        const output = outputs[0];

        output.forEach((channel, ch_i) => {
            for (let i = 0; i < channel.length; i++) {

                let inp = (inputs[ch_i] || []),
                    inp_ch0 = inp[0] || [];
                channel[i] = inp_ch0[i] || 0;
            }
        });
        // as this is a source node which generates its own output,
        // we return true so it won't accidentally get garbage-collected
        // if we don't have any references to it in the main thread
        return this.running;
    }
}

registerProcessor("channel-router-processor", ChannelRouterProcessor);