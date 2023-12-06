import { get_docfrag, generate_osctype_enum } from "../utils";

export const RM = _RM;
export default RM;

function _RM(opts) {
    return Object.assign(this, {
        mod: {},
        opts: Object.assign({
            carrier_freq: 220,
            carrier_type: 'sine',
            modulator_freq: 10,
            modulator_type: 'sine',
            carrier_g: .8,
            modulator_g: 2
        }, opts || {}),
        init: _init.bind(this),
        start: _start.bind(this),
        stop: _stop.bind(this)
    });
}

function _init(config) {
    const { ctx, master_g } = config;

    let carrier = ctx.createOscillator(),
        c_g = ctx.createGain(),
        modulator = ctx.createOscillator(),
        m_g = ctx.createGain();

    carrier.frequency.value = this.opts.carrier_freq;
    this.opts.carrier_freq_param = carrier.frequency;

    modulator.frequency.value = this.opts.modulator_freq;
    this.opts.modulator_freq_param = modulator.frequency;

    carrier.type = this.opts.carrier_type;
    this.opts.carrier_type_enum = generate_osctype_enum(carrier);

    modulator.type = this.opts.modulator_type;
    this.opts.modulator_type_enum = generate_osctype_enum(modulator);

    c_g.gain.value = this.opts.carrier_g;
    this.opts.carrier_g_param = c_g.gain;

    m_g.gain.value = this.opts.modulator_g;
    this.opts.modulator_g_param = m_g.gain;

    modulator
        .connect(m_g)
        .connect(c_g);

    carrier
        .connect(c_g)
        .connect(master_g);

    Object.assign(this.mod, {
        carrier, c_g, modulator, m_g
    });

    let ret = this;
    if (config.show_docfrag) {
        window.RM = this.mod;
        ret = get_docfrag(this, config);
    }
    return ret;
}
function _start(config) {
    const { carrier, modulator } = this.mod;
    [carrier, modulator].forEach(osc => osc.start());
}
function _stop(config) {
    const { carrier, modulator } = this.mod;
    [carrier, modulator].forEach(osc => osc.stop());
}