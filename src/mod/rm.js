export const RM = _RM;

function _RM(opts) {
    return Object.assign(this, {
        mod: Object.assign({}, opts || {}),
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

    carrier.frequency.value = 220;
    modulator.frequency.value = 10;

    modulator
        .connect(m_g)
        .connect(c_g);

    carrier
        .connect(c_g)
        .connect(master_g);

    Object.assign(this.mod, {
        carrier, c_g, modulator, m_g
    });
    
    window.RM = this.mod;
}
function _start(config) {
    const {carrier, modulator} = this.mod;
    [carrier, modulator].forEach(osc => osc.start());
}
function _stop(config) { 
    const {carrier, modulator} = this.mod;
    [carrier, modulator].forEach(osc => osc.stop());
}