//solution based on what we found here: https://github.com/webpack/webpack/issues/11543#issuecomment-956055541
import { AudioWorklet } from "../audio-worklet";
import { generate_osctype_enum, get_docfrag, update_docfrag } from "../utils";

///////////////////////////
//Mix Crossfading using audio worklets
///////////////////////////

let _DOCFRAG = null;

export const LinearCrossfading = _LinearCrossfading;
export default LinearCrossfading;

function _LinearCrossfading(opts) {
    Object.assign(this, {
        mod: {},
        opts: Object.assign({
            osc1_freq: 2,
            osc1_type: 'sawtooth',
            osc2_freq: 3.5,
            osc2_type: 'square',
            cf_amount: {
                value: .2,
                max: 1
            },
            cf_mix_length: {
                value: 0.01,
                step: 0.01
            }
        }, opts || {}),
        init: _init.bind(this),
        start: _start.bind(this),
        stop: _stop.bind(this)
    });
}

function _init(config) {
    const { ctx, master_g } = config;

    let osc_1 = ctx.createOscillator();
    osc_1.frequency.value = this.opts.osc1_freq;
    this.opts.osc1_freq_param = osc_1.frequency;
    osc_1.type = this.opts.osc1_type;
    this.opts.osc1_type_enum = generate_osctype_enum(osc_1);

    let osc_2 = ctx.createOscillator();
    osc_2.frequency.value = this.opts.osc2_freq;
    this.opts.osc2_freq_param = osc_2.frequency;
    osc_2.type = this.opts.osc2_type;
    this.opts.osc2_type_enum = generate_osctype_enum(osc_2);

    let cfp = new AudioWorklet(new URL('../worklet/MixCrossfadingProcessor.js', import.meta.url));
    ctx.audioWorklet.addModule(cfp).then(() => {
        const cfpNode = new AudioWorkletNode(
            ctx,
            "mix-crossfading-processor",
            {
                numberOfInputs: 2,
                numberOfOutputs: 2
            }
        );

        let cfp_amout = cfpNode.parameters.get('amount');
        cfp_amout.value = this.opts.cf_amount.value;
        this.opts.cf_amount_param = cfp_amout;

        let cfp_mix_length = cfpNode.parameters.get('mix_length');
        cfp_mix_length.value = this.opts.cf_mix_length.value;
        this.opts.cf_mix_length_param = cfp_mix_length;

        osc_1.connect(cfpNode);
        osc_2.connect(cfpNode, 0, 1);
        cfpNode.connect(master_g);

        Object.assign(this.mod, {
            cfpNode
        });

        if (config.show_docfrag && config.container) {
            //this might be refactored...
            let df = update_docfrag(_DOCFRAG, {
                opts: {
                    cf_amount: this.opts.cf_amount,
                    cf_amount_param: this.opts.cf_amount_param,
                    cf_mix_length: this.opts.cf_mix_length,
                    cf_mix_length_param: this.opts.cf_mix_length_param
                }
            }, config);
            config.container.appendChild(df);
        }
    });

    window.LinearCrossfading = this.mod;

    Object.assign(this.mod, {
        osc_1, osc_2
    });

    let ret = this;
    if (config.show_docfrag) {
        _DOCFRAG = get_docfrag(this, config);
        ret = _DOCFRAG;
    }
    return ret;
}

//////////////////////////////////////////////
//////////////////////////////////////////////


function _start(config) {
    const { osc_1, osc_2 } = this.mod;
    [osc_1, osc_2].forEach(osc => osc.start());
}
function _stop(config) {
    const { osc_1, osc_2 } = this.mod;
    [osc_1, osc_2].forEach(osc => osc.stop());
}