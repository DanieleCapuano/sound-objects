//AUDIO WORKLET PROCESSOR for Channel Phasing
//start code from
//https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor/process

//Crossfading Processor
class CrossfadingProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
        // take the first output
        const output = outputs[0];

        const input_1 = inputs[0][0] || [];
        const input_2 = inputs[1][0] || [];

        output.forEach((channel) => {
            for (let i = 0; i < channel.length; i++) {
                let amount = // the array can contain 1 or 128 values
                    // depending on if the automation is present
                    // and if the automation rate is k-rate or a-rate
                    (parameters["amount"].length > 1
                        ? parameters["amount"][i]
                        : parameters["amount"][0]),
                    in1_sample = input_1[i] || 0,
                    in2_sample = input_2[i] || 0;

                amount = isNaN(amount) ? .5 : Math.max(0, Math.min(1, amount));

                //linear interpolation of inputs based on amount parameter
                channel[i] = in1_sample * (1 - amount) + in2_sample * amount;
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
                name: "amount",
                defaultValue: .5,
                minValue: 0,
                automationRate: "k-rate",
            },
        ];
    }
}

registerProcessor("crossfading-processor", CrossfadingProcessor);