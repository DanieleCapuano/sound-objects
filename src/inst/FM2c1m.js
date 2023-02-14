import { get_docfrag } from "../utils";

//2 Carriers and 1 Modulator
export const FM2c1m = _FM2c1m;
export default FM2c1m;

function _FM2c1m(opts) {
    Object.assign(this, {
        mod: {},
        opts: Object.assign({
            modulator_freq: 7,
            d_gain: 40,
            carrier1_freq: 200,
            carrier2_freq: 40,
            carrier_g: .1
        }, opts || {}),
        init: _init.bind(this),
        start: _start.bind(this),
        stop: _stop.bind(this)
    });
}

//additive carriers with independent modulators

function _init(config) {
    const { ctx, master_g } = config;

    let m = ctx.createOscillator(),
        d = ctx.createGain(),
        c1 = ctx.createOscillator(),
        c2 = ctx.createOscillator(),
        g = ctx.createGain();

    m.frequency.value = this.opts.modulator_freq;
    this.opts.modulator_freq_param = m.frequency;

    d.gain.value = this.opts.d_gain;
    this.opts.d_gain_param = d.gain;

    c1.frequency.value = this.opts.carrier1_freq;
    this.opts.carrier1_freq_param = c1.frequency;

    c2.frequency.value = this.opts.carrier2_freq;
    this.opts.carrier2_freq_param = c2.frequency;

    g.gain.value = this.opts.carrier_g;
    this.opts.carrier_g_param = g.gain;

    m.connect(d);
    d.connect(c1.frequency);
    d.connect(c2.frequency);

    c1.connect(g);
    c2.connect(g.gain);

    g.connect(master_g);

    Object.assign(this.mod, {
        m, d, c1, c2, g
    });

    window.FM2c1m = this.mod;
    return config.show_docfrag ? get_docfrag(this, config) : this;
}

function _start(config) {
    const { m, c1, c2 } = this.mod;
    [m, c1, c2].forEach(osc => osc.start());
}

function _stop(config) {
    const { m, c1, c2 } = this.mod;
    [m, c1, c2].forEach(osc => osc.stop());
}