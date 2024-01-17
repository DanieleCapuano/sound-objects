//solution based on what we found here: https://github.com/webpack/webpack/issues/11543#issuecomment-956055541
import { AudioWorklet } from "../audio-worklet";
import { clear_data, generate_osctype_enum, get_docfrag, update_docfrag } from "../utils";

///////////////////////////
//Mix Crossfading using audio worklets
///////////////////////////

let _DOCFRAG = null,
    _init_promise = null;

export const MixCrossfading = _MixCrossfading;
export default MixCrossfading;

function _MixCrossfading(opts) {
    Object.assign(this, {
        mod: {},
        opts: Object.assign({
            a1_g: .5,
            a2_g: .5,
            cf_amount: {
                value: .5,
                max: 1
            },
            cf_mix_length: {
                value: 0.06,
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
    let cfp = new AudioWorklet(new URL('../worklet/MixCrossfadingProcessor.js', import.meta.url));
    _init_promise = new Promise((res) => {
        Promise.all([
            fetch('/audio/drop.wav'),
            fetch('/audio/voice.wav'),
            ctx.audioWorklet.addModule(cfp)
        ]).then((objs) => {
            const cfpNode = new AudioWorkletNode(
                ctx,
                "mix-crossfading-processor",
                {
                    numberOfInputs: 2,
                    numberOfOutputs: 2
                }
            );

            let should_update_docfrag = true;
            if (this.opts.cf_amount_param) should_update_docfrag = false;

            let cfp_amout = cfpNode.parameters.get('amount');
            cfp_amout.value = this.opts.cf_amount.value;
            this.opts.cf_amount_param = cfp_amout;

            let cfp_mix_length = cfpNode.parameters.get('mix_length');
            cfp_mix_length.value = this.opts.cf_mix_length.value;
            this.opts.cf_mix_length_param = cfp_mix_length;

            Object.assign(this.mod, {
                cfpNode,
            });

            if (config.show_docfrag && config.container && should_update_docfrag) {
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


            Promise.all(
                [objs[0], objs[1]].map(audio => audio.arrayBuffer())
            ).then(bufs => {
                const o_vals = [this.opts.a1_g, this.opts.a2_g];
                let bufs_count = bufs.length;

                bufs.forEach((audioData, i) => {
                    ctx.decodeAudioData(audioData, (buffer) => {
                        let bs = ctx.createBufferSource(),
                            bs_g = ctx.createGain(),
                            lpf = ctx.createBiquadFilter();
                        bs.buffer = buffer;
                        bs.loop = true;
                        if (i === 1) {
                            bs.detune.value = 100;
                            bs.playbackRate.value = .4;
                        }
                        bs_g.gain.value = o_vals[i];
                        lpf.type = 'highpass';
                        lpf.value = 400;

                        bs
                            .connect(lpf)
                            .connect(bs_g)
                            .connect(cfpNode, 0, i);
                        cfpNode.connect(master_g);

                        Object.assign(this.mod, {
                            ["bs_" + i]: bs,
                            ["bs_g_" + i]: bs_g,
                        });

                        if (--bufs_count <= 0) {
                            res();
                        }
                    });
                });
            })
        });
    })

    let ret = this;
    if (config.show_docfrag) {
        window.MixCrossfading = this.mod;
        _DOCFRAG = get_docfrag(this, config);
        ret = _DOCFRAG;
    }
    return ret;
}

//////////////////////////////////////////////
//////////////////////////////////////////////


function _start(config) {
    _init_promise.then(() => {
        const { bs_0, bs_1 } = this.mod;
        [bs_0, bs_1].forEach(bs => bs.start());
    });
}
function _stop(config) {
    _init_promise.then(() => {
        const { bs_0, bs_1, cfpNode } = this.mod;
        [bs_0, bs_1].forEach(bs => bs.stop());
        clear_data(config.container, cfpNode);
        _DOCFRAG = null;
        _init_promise = null;
    });
}