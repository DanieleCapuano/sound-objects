export const AM = _AM;

function _AM(opts) {
    Object.assign(this, {
        mod: Object.assign({}, opts || {}),
        init: _init.bind(this),
        start: _start.bind(this),
        stop: _stop.bind(this)
    });
}

function _init(config) {
    const { ctx, master_g } = config;

    let g = ctx.createGain(),
        carrier = ctx.createOscillator(),
        c_g = ctx.createGain(),
        modulator = ctx.createOscillator(),
        m_g = ctx.createGain();

    carrier.frequency.value = 220;
    modulator.frequency.value = 10;

    c_g.gain.value = .8;
    modulator
        .connect(m_g)
        .connect(c_g.gain); //"audio signals from the outputs of AudioNodes can be connected to an AudioParam, ***summing*** 
    //with the intrinsic parameter value."
    //check https://webaudio.github.io/web-audio-api/#AudioParam

    carrier
        .connect(c_g)
        .connect(g)
        .connect(master_g);

    Object.assign(this.mod, {
        g, carrier, c_g, modulator, m_g
    });

    window.AM = this.mod;
}
function _start(config) {
    const { carrier, modulator } = this.mod;
    [carrier, modulator].forEach(osc => osc.start());
}
function _stop(config) {
    const { carrier, modulator } = this.mod;
    [carrier, modulator].forEach(osc => osc.stop());
}