import { get_docfrag } from "../utils";

//1 Carrier and 2 parallel Modulators
export const FM1c2m = _FM1c2m;
export default FM1c2m;

function _FM1c2m(opts) {
    Object.assign(this, {
        mod: {},
        opts: Object.assign({
            modulator1_freq: 7,
            d1_gain: 40,
            modulator2_freq: 22,
            d2_gain: 20,
            mods_g: 1,
            carrier_freq: 100,
            carrier_g: 1
        }, opts || {}),
        init: _init.bind(this),
        start: _start.bind(this),
        stop: _stop.bind(this)
    });
}

//additive carriers with independent modulators

function _init(config) {
    const { ctx, master_g } = config;

    let m1 = ctx.createOscillator(),
        d1 = ctx.createGain(),
        m2 = ctx.createOscillator(),
        d2 = ctx.createGain(),
        mods_g = ctx.createGain(),
        c = ctx.createOscillator(),
        g = ctx.createGain();

    m1.frequency.value = this.opts.modulator1_freq;
    this.opts.modulator1_freq_param = m1.frequency;
    d1.gain.value = this.opts.d1_gain;
    this.opts.d1_gain_param = d1.gain;

    m2.frequency.value = this.opts.modulator2_freq;
    this.opts.modulator2_freq_param = m2.frequency;
    d2.gain.value = this.opts.d2_gain;
    this.opts.d2_gain_param = d2.gain;

    mods_g.gain.value = this.opts.mods_g;
    this.opts.mods_g_param = mods_g.gain; 

    c.frequency.value = this.opts.carrier_freq;
    this.opts.carrier_freq_param = c.frequency;

    g.gain.value = this.opts.carrier_g;
    this.opts.carrier_g_param = g.gain;

    m1.connect(d1);
    m2.connect(d2);
    d1.connect(mods_g);
    d2.connect(mods_g.gain);

    mods_g.connect(c.frequency);
    c.connect(g);

    g.connect(master_g);

    Object.assign(this.mod, {
        m1, d1, m2, d2, mods_g, c, g
    });

    window.FM1c2m = this.mod;
    return config.show_docfrag ? get_docfrag(this, config) : this;
}

function _start(config) {
    const { m1, m2, c } = this.mod;
    [m1, m2, c].forEach(osc => osc.start());
}

function _stop(config) {
    const { m1, m2, c } = this.mod;
    [m1, m2, c].forEach(osc => osc.stop());
}