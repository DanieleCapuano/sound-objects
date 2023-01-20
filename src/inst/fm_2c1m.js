//2 Carriers and 1 Modulator
export const FM_2c1m = _FM_2c1m;

function _FM_2c1m(opts) {
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

    let m = ctx.createOscillator(),
        d = ctx.createGain(),
        c1 = ctx.createOscillator(),
        c2 = ctx.createOscillator(),
        g = ctx.createGain();

    m.frequency.value = 7;
    d.gain.value = 40;
    c1.frequency.value = 200;
    c2.frequency.value = 40;
    g.gain.value = .1;

    m.connect(d);
    d.connect(c1.frequency);
    d.connect(c2.frequency);

    c1.connect(g);
    c2.connect(g.gain);

    if (!this.mod.floating_mod) {
        g.connect(master_g);
    }

    Object.assign(this.mod, {
        m, d, c1, c2, g
    });

    window.FM_2c1m = this.mod;
}

function _start(config) {
    const { m, c1, c2 } = this.mod;
    [m, c1, c2].forEach(osc => osc.start());
}

function _stop(config) {
    const { m, c1, c2 } = this.mod;
    [m, c1, c2].forEach(osc => osc.stop());
}