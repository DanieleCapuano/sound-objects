/*
    we cannot import worklets like this because it tries to execute the AudioWorkletProcessor outside a worker so it fails
    we'll have a list of worklet-based instruments which will execute nodes using worklets
*/
// import * as worklets from './worklet';

//solution based on what we found here: https://github.com/webpack/webpack/issues/11543#issuecomment-956055541
import { AudioWorklet } from "../audio-worklet";
import { clear_data, generate_osctype_enum, get_docfrag } from "../utils";

///////////////////////////
//Channel router: this simply routes 2 inputs on different channels
//every input is connected to both channels using different gains, so we can create spatial effects
///////////////////////////

export const CHRouter2In6Out = _CHRouter2In6Out;
export default CHRouter2In6Out;

function _CHRouter2In6Out(opts) {
    Object.assign(this, {
        mod: {},
        opts: Object.assign({
            osc_l_freq: 110,
            osc_l_type: 'sine',
            osc_l_gain_l: .8,
            osc_l_gain_r: .2,

            osc_r_freq: 70,
            osc_r_type: 'sine',
            osc_r_gain_l: .2,
            osc_r_gain_r: .8,

        }, opts || {}),
        init: _init.bind(this),
        start: _start.bind(this),
        stop: _stop.bind(this)
    });
}

function _init(config) {
    const { ctx, master_g } = config;

    let chp = new AudioWorklet(new URL('../worklet/ChannelRouterProcessor.js', import.meta.url));
    ctx.audioWorklet.addModule(chp).then(() => {
        const chrNode = new AudioWorkletNode(
            ctx,
            "channel-router-processor",
            {
                numberOfInputs: 2,
                numberOfOutputs: 1,
                outputChannelCount: [6]
            }
        );
        chrNode.port.postMessage({
            type: 'set_channels_mapping',
            value: {
                0: 0,
                1: 1,
                2: 0,
                3: 1,
                4: 0,
                5: 1
            }
        });
        chrNode.channelCountMode = 'explicit';
        chrNode.channelInterpretation = 'discrete';

        ctx.destination.channelCount = 6;
        ctx.destination.channelCountMode = 'explicit';
        ctx.destination.channelInterpretation = 'discrete';
        master_g.channelCount = 6;
        master_g.channelCountMode = 'explicit';
        master_g.channelInterpretation = 'discrete';

        //every input is connected to both channels using different gains, so we can create spatial effects
        osc_l
            .connect(osc_l_gl)
            .connect(master_l);

        osc_l
            .connect(osc_l_gr)
            .connect(master_r);

        osc_r
            .connect(osc_r_gl)
            .connect(master_l);
        osc_r
            .connect(osc_r_gr)
            .connect(master_r);

        master_l
            .connect(chrNode, 0, 0)
            .connect(master_g);

        master_r
            .connect(chrNode, 0, 1)
            .connect(master_g);


        Object.assign(this.mod, {
            chrNode
        });

    });

    let master_l = ctx.createGain(),
        master_r = ctx.createGain();

    /////LEFT
    let osc_l = ctx.createOscillator(),
        osc_l_gl = ctx.createGain(),
        osc_l_gr = ctx.createGain();

    osc_l.frequency.value = this.opts.osc_l_freq;
    this.opts.osc_l_freq_param = osc_l.frequency;
    osc_l.type = this.opts.osc_l_type;
    this.opts.osc_l_type_enum = generate_osctype_enum(osc_l);
    osc_l_gl.gain.value = this.opts.osc_l_gain_l;
    this.opts.osc_l_gain_l_param = osc_l_gl.gain;
    osc_l_gr.gain.value = this.opts.osc_l_gain_r;
    this.opts.osc_l_gain_r_param = osc_l_gr.gain;


    ///RIGHT
    let osc_r = ctx.createOscillator(),
        osc_r_gl = ctx.createGain(),
        osc_r_gr = ctx.createGain();

    osc_r.frequency.value = this.opts.osc_r_freq;
    this.opts.osc_r_freq_param = osc_r.frequency;
    osc_r.type = this.opts.osc_r_type;
    this.opts.osc_r_type_enum = generate_osctype_enum(osc_r);
    osc_r_gl.gain.value = this.opts.osc_r_gain_l;
    this.opts.osc_r_gain_l_param = osc_r_gl.gain;
    osc_r_gr.gain.value = this.opts.osc_r_gain_r;
    this.opts.osc_r_gain_r_param = osc_r_gr.gain;

    window.CHRouter2In6Out = this.mod;

    Object.assign(this.mod, {
        osc_l,
        osc_l_gl,
        osc_l_gr,
        osc_r,
        osc_r_gl,
        osc_r_gr
    });

    let ret = this;
    if (config.show_docfrag) {
        ret = get_docfrag(this, config);
    }
    return ret;
}


//////////////////////////////////////////////
//////////////////////////////////////////////


function _start(config) {
    const { osc_l, osc_r } = this.mod;
    [osc_l, osc_r].forEach(osc => osc.start());
}
function _stop(config) {
    const { ctx, master_g, container } = config;

    ctx.destination.channelCount = 2;
    ctx.destination.channelCountMode = 'max';
    ctx.destination.channelInterpretation = 'speakers';
    master_g.channelCount = 2;
    master_g.channelCountMode = 'max';
    master_g.channelInterpretation = 'speakers';

    const { osc_l, osc_r, chrNode } = this.mod;
    [osc_l, osc_r].forEach(osc => osc.stop());
    clear_data(container, chrNode);
}