import { generate_osctype_enum, get_docfrag } from "../utils";

//WAVESHAPING!

export const WS = _WS;
export default WS;

function _WS(opts) {
    Object.assign(this, {
        mod: {},
        opts: Object.assign({
            carrier_freq: 220,
            carrier_type: 'sine',
            carrier_g: 1,
            shaping_amount: 20
        }, opts || {}),
        init: _init.bind(this),
        start: _start.bind(this),
        stop: _stop.bind(this)
    });
}

function _init(config) {
    const { ctx, master_g } = config;

    let ws = ctx.createWaveShaper(),
        carrier = ctx.createOscillator(),
        c_g = ctx.createGain();

    carrier.frequency.value = this.opts.carrier_freq;
    this.opts.carrier_freq_param = carrier.frequency;
    
    carrier.type = this.opts.carrier_type;
    this.opts.carrier_type_enum = generate_osctype_enum(carrier);

    c_g.gain.value = this.opts.carrier_g;
    this.opts.carrier_g_param = c_g.gain;

    ws.curve = makeDistortionCurve(this.opts.shaping_amount);
    this.opts.shaping_amount_enum = {
        values: 'int',
        onchange: (val) => ws.curve = makeDistortionCurve(parseFloat(val))
    };

    carrier
        .connect(c_g)
        .connect(ws)
        .connect(master_g);

    Object.assign(this.mod, {
        carrier, c_g, ws
    });

    window.WS = this.mod;

    return config.show_docfrag ? get_docfrag(this, config) : this;
}

//see https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createWaveShaper#example
function makeDistortionCurve(amount) {
    const k = typeof amount === "number" ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;

    for (let i = 0; i < n_samples; i++) {
        const x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
}

function _start(config) {
    const { carrier } = this.mod;
    carrier.start();
}
function _stop(config) {
    const { carrier } = this.mod;
    carrier.stop();
}