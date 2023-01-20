import { FM } from "../mod/fm";

//ACIM - Additive Carriers and Independent Modulator
export const FM_acim = _FM_acim;

function _FM_acim(opts) {
    Object.assign(this, {
        mod: Object.assign({}, opts || {}),
        init: _init.bind(this),
        start: _start.bind(this),
        stop: _stop.bind(this)
    });
}

//additive carriers with independent modulators

function _init(config) {
    const { ctx, master_g } = config;

    let m1 = new FM({ carrier_freq: 80, modulator_freq: 20, d_gain: 10, floating_mod: true }),
        m2 = new FM({ carrier_freq: 120, modulator_freq: 22, d_gain: 10, floating_mod: true }),
        g = ctx.createGain();

    m1.init(config);
    m2.init(config);

    m1.mod.c_g.connect(g);
    m2.mod.c_g.connect(g.gain);

    if (!this.mod.floating_mod) {
        g.connect(master_g);
    }

    Object.assign(this.mod, {
        m1, m2
    });

    window.FM_acim = this.mod;
}

function _start(config) {
    Object.keys(this.mod).forEach(m_key => {
        const
            m_n = this.mod[m_key],
            { mod } = m_n,
            { carrier, modulator } = mod;
        [carrier, modulator].forEach(osc => osc.start());
    });
}
function _stop(config) {
    Object.keys(this.mod).forEach(m_key => {
        const
            m_n = this.mod[m_key],
            { mod } = m_n,
            { carrier, modulator } = mod;
        [carrier, modulator].forEach(osc => osc.stop());
    });
}