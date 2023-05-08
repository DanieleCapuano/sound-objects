//AUDIO WORKLET PROCESSOR for Channel Router
//start code from
//https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor/process

//Channel Router Processor: this simply sends different inputs to different channels of a single output
class ChannelRouterProcessor extends AudioWorkletProcessor {
    running = true;

    //keys: output channels (currently up to 6)
    //values: input connections index whose data will be sent to the corresponding out channel
    channels_mapping = {
        0: 0,
        1: 1,
        2: 0,
        3: 1,
        4: 0,
        5: 1
    };

    constructor(...args) {
        super(...args);
        this.port.onmessage = (e) => {
            let d = e.data;
            if (d.type === 'set_running') {
                this.running = d.value;
            }
            else if (d.type === 'set_channels_mapping') {
                this.channels_mapping = d.value;
            }
        };
        console.info(args);
    };

    process(inputs, outputs) {
        // take the first output
        const output = outputs[0];

        output.forEach((channel, ch_i) => {
            for (let i = 0; i < channel.length; i++) {
                let inp_obj = this.channels_mapping[ch_i],
                    inp_i = inp_obj !== undefined ? inp_obj : 10,
                    inp = (inputs[inp_i] || []),
                    inp_ch0 = inp[0] || [];
                let val = inp_ch0[i] || 0;

                channel[i] = val;
            }
        });
        // as this is a source node which generates its own output,
        // we return true so it won't accidentally get garbage-collected
        // if we don't have any references to it in the main thread
        return this.running;
    }
}

registerProcessor("channel-router-processor", ChannelRouterProcessor);