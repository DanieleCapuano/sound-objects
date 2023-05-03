//AUDIO WORKLET PROCESSOR for Channel Phasing
//start code from
//https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor/process

//MixCrossfading Processor: it has an "amount" parameter which controls what is 
//the percentage of the input signal to insert in the output mix
class MixCrossfadingProcessor extends AudioWorkletProcessor {
    running = true;

    constructor(...args) {
        super(...args);
        this.port.onmessage = (e) => {
            this.running = e.data;
        };
    };

    process(inputs, outputs, parameters) {
        // take the first output
        const output = outputs[0];

        const input_1 = (inputs[0] || [])[0] || [];
        const input_2 = (inputs[1] || [])[0] || [];

        let amount = parameters.amount[0],
            mix_length = parameters.mix_length[0],
            toggle = 0.,
            input_a = [input_1, input_2],
            percs = [0., 0.],
            smooth = 1;

        output.forEach((channel) => {
            for (let i = 0; i < channel.length; i++) {
                amount = isNaN(amount) ? .5 : parseFloat(Math.max(0, Math.min(1, amount)).toPrecision(1));
                mix_length = isNaN(mix_length) ? .1 : parseFloat(Math.max(0, mix_length).toPrecision(2));
                smooth = smooth === 1 ? smooth : smooth + .01;

                if (Math.abs(percs[0] - amount) < 0.1 && amount !== 0.) { //second condition to avoid entering this "if" all the time
                    toggle = 1;
                    percs[toggle] = 0;
                    percs[1 - toggle] = 0;
                    smooth = 0;
                }
                else if (Math.abs(percs[1] - amount) < 0.1 && amount !== 1) { //second condition to avoid entering this "if" all the time
                    toggle = 0;
                    percs[toggle] = 0;
                    percs[1 - toggle] = 0;
                    smooth = 0;
                }

                channel[i] = input_a[toggle][i] * smooth + input_a[1 - toggle][i] * (1 - smooth);
                channel[i] = isNaN(channel[i]) ? 0 : channel[i];
                percs[toggle] = parseFloat((percs[toggle] + mix_length).toPrecision(2));
            }
        });
        // as this is a source node which generates its own output,
        // we return true so it won't accidentally get garbage-collected
        // if we don't have any references to it in the main thread
        return this.running;
    }
    // define the customGain parameter used in process method
    static get parameterDescriptors() {
        return [
            {
                name: "amount",
                defaultValue: .5,
                minValue: 0,
                automationRate: "k-rate",
            },
            {
                name: "mix_length",
                defaultValue: .1,
                minValue: 0.01,
                automationRate: "k-rate",
            },
        ];
    }
}

registerProcessor("mix-crossfading-processor", MixCrossfadingProcessor);