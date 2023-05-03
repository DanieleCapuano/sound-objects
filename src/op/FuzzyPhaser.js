//solution based on what we found here: https://github.com/webpack/webpack/issues/11543#issuecomment-956055541
import { AudioWorklet } from "../audio-worklet";
import { clear_data, generate_osctype_enum, get_docfrag, update_docfrag } from "../utils";

///////////////////////////
//Fuzzy phaser using audio worklets...quite noisy and fool, 
//but it's the first experiment using both soundo modules and worklet processors together!
///////////////////////////

let _DOCFRAG = null;

export const CHPhaser = _CHPhaser;
export default CHPhaser;

function _CHPhaser(opts) {
    Object.assign(this, {
        mod: {},
        opts: Object.assign({
            osc_freq: 220,
            osc_type: 'sine',
            chp_freq: 5.7
        }, opts || {}),
        init: _init.bind(this),
        start: _start.bind(this),
        stop: _stop.bind(this)
    });
}

function _init(config) {
    const { ctx, master_g } = config;

    let chp = new AudioWorklet(new URL('../worklet/FuzzyProcessor.js', import.meta.url));
    ctx.audioWorklet.addModule(chp).then(() => {
        const chpNode = new AudioWorkletNode(
            ctx,
            "ch-phaser-processor",
            {
                numberOfOutputs: 1,
                outputChannelCount: [2]
            }
        );

        let should_update_docfrag = true;
        if (this.opts.chp_freq_param) should_update_docfrag = false;

        let chpFreq = chpNode.parameters.get('frequency');
        chpFreq.value = this.opts.chp_freq;
        this.opts.chp_freq_param = chpFreq;

        osc
            .connect(chpNode)
            .connect(master_g);

        Object.assign(this.mod, {
            chpNode
        });

        if (config.show_docfrag && config.container && should_update_docfrag) {
            //this might be refactored...
            let df = update_docfrag(_DOCFRAG, {
                opts: {
                    chp_freq: this.opts.chp_freq,
                    chp_freq_param: this.opts.chp_freq_param
                }
            }, config);
            config.container.appendChild(df);
        }
    });

    let osc = ctx.createOscillator();

    osc.frequency.value = this.opts.osc_freq;
    this.opts.osc_freq_param = osc.frequency;

    osc.type = this.opts.osc_type;
    this.opts.osc_type_enum = generate_osctype_enum(osc);

    window.CHPhaser = this.mod;

    Object.assign(this.mod, {
        osc
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
    const { osc } = this.mod;
    osc.start();
}
function _stop(config) {
    const { osc, chpNode } = this.mod;
    osc.stop();
    clear_data(config.container, chpNode);
    _DOCFRAG = null;
}