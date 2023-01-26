import { FM } from "../mod/fm";

//ACIM - Additive Carriers and Independent Modulator
export const FM_acim = _FM_acim;

function _FM_acim(opts) {
    Object.assign(this, {
        mod: {},
        opts: Object.assign({
            m1_carrier_freq: 80,
            m1_modulatr_freq: 20,
            m1_d_gain: 10,
            m1_carrier_g: .8,
            m2_carrier_freq: 120,
            m2_modulator_freq: 22,
            m2_d_gain: 10,
            m2_carrier_g: .8,
            inst_g: 1
        }, opts || {}),
        init: _init.bind(this),
        start: _start.bind(this),
        stop: _stop.bind(this)
    });
}

//additive carriers with independent modulators

function _init(config) {
    const { ctx, master_g } = config;

    let /////////////////////////////////
        m1 = new FM({
            carrier_freq: this.opts.m1_carrier_freq,
            modulator_freq: this.opts.m1_modulatr_freq,
            d_gain: this.opts.m1_d_gain,
            master_g: g
        }),
        m2 = new FM({
            carrier_freq: this.opts.m2_carrier_freq,
            modulator_freq: this.opts.m2_modulator_freq,
            d_gain: this.opts.m2_d_gain,
            master_g: g.gain
        }),
        g = ctx.createGain();
    g.gain.value = this.opts.inst_g;

    let m1_docfrag = m1.init(config),
        m2_docfrag = m2.init(config);

    g.connect(master_g);

    Object.assign(this.mod, {
        m1, m2
    });

    window.FM_acim = this.mod;
    return get_docfrag(this, config, m1_docfrag, m2_docfrag);
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
function get_docfrag(o, config, m1_docfrag, m2_docfrag) {
    let d = new DocumentFragment();

    [m1_docfrag, m2_docfrag].forEach((df, i) => {
        let cont = document.createElement('div');
        let m_i = i + 1;
        cont.classList.add('container', 'opt-container', 'fm-acim', 'mod-' + m_i);

        let l = document.createElement('div');
        l.classList.add('label');
        l.textContent = 'FM MOD ' + m_i;

        cont.appendChild(l);
        cont.appendChild(df);
        d.appendChild(cont);
    });

    return d;
}