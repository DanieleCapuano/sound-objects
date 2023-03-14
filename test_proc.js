//AUDIO WORKLET PROCESSOR TEST
//start code from
//https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor/process

class WhiteNoiseProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
        // take the first output
        const output = outputs[0];
        const input = inputs[0][0];
        let d = new Date().getTime();
        output.forEach((channel, ch_i) => {
            for (let i = 0; i < channel.length; i++) {
                channel[i] =
                    input[i] * Math.abs((Math.sin(d * (.0001 * (ch_i + 1))) * (ch_i + 1))) *
                    // the array can contain 1 or 128 values
                    // depending on if the automation is present
                    // and if the automation rate is k-rate or a-rate
                    (parameters["customGain"].length > 1
                        ? parameters["customGain"][i]
                        : parameters["customGain"][0]);
            }
        });
        // as this is a source node which generates its own output,
        // we return true so it won't accidentally get garbage-collected
        // if we don't have any references to it in the main thread
        return true;
    }
    // define the customGain parameter used in process method
    static get parameterDescriptors() {
        return [
            {
                name: "customGain",
                defaultValue: 1,
                minValue: 0,
                maxValue: 1,
                automationRate: "a-rate",
            },
        ];
    }
}

registerProcessor("white-noise-processor", WhiteNoiseProcessor);