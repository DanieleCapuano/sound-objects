import { generate_osctype_enum, get_docfrag } from "../utils";

//Self-modulating Carrier
export const FMselfc = _FMselfc;
export default FMselfc;

function _FMselfc(opts) {
    Object.assign(this, {
        mod: {},
        opts: Object.assign({
            mod_g: 1,
            carrier_freq: 100,
            carrier_type: 'sine',
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

    let mod_g = ctx.createGain(),
        c = ctx.createOscillator(),
        g = ctx.createGain();

    mod_g.gain.value = this.opts.mod_g;
    this.opts.mod_g_param = mod_g.gain; 

    c.frequency.value = this.opts.carrier_freq;
    this.opts.carrier_freq_param = c.frequency;

    c.type = this.opts.carrier_type;
    this.opts.carrier_type_enum = generate_osctype_enum(c);

    g.gain.value = this.opts.carrier_g;
    this.opts.carrier_g_param = g.gain;

    c.connect(g);
    g.connect(mod_g);
    mod_g.connect(c.frequency);

    g.connect(master_g);

    Object.assign(this.mod, {
        c, g, mod_g
    });

    window.FM_selfc = this.mod;
    return config.show_docfrag ? get_docfrag(this, config) : this;
}

function _start(config) {
    const { c } = this.mod;
    c.start();
}

function _stop(config) {
    const { c } = this.mod;
    c.stop();
}