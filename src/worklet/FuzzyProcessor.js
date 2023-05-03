//AUDIO WORKLET PROCESSOR for Channel Phasing
//start code from
//https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor/process

//CHannels Phaser - first experiment with audio worklets
class CHPhaserProcessor extends AudioWorkletProcessor {
    running = true;

    constructor(...args) {
        super(...args);
        this.port.onmessage = (e) => {
            this.running = e.data;
        };
    }

    process(inputs, outputs, parameters) {
        // take the first output
        const output = outputs[0];
        const input = (inputs[0] || [])[0] || [];
        let d = new Date().getTime();
        output.forEach((channel, ch_i) => {
            for (let i = 0; i < channel.length; i++) {
                let frq = // the array can contain 1 or 128 values
                    // depending on if the automation is present
                    // and if the automation rate is k-rate or a-rate
                    (parameters["frequency"].length > 1
                        ? parameters["frequency"][i]
                        : parameters["frequency"][0]);

                channel[i] = input[i] * Math.abs((Math.sin(d * (frq * (ch_i + 1))) * (ch_i + 1)));

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
                name: "frequency",
                defaultValue: .001,
                minValue: 0.001,
                maxValue: 100,
                automationRate: "a-rate",
            },
        ];
    }
}

registerProcessor("ch-phaser-processor", CHPhaserProcessor);