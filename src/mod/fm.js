export const FM = _FM;

function _FM(opts) {
    Object.assign(this, {
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
        d = ctx.createGain();               //frequency deviation

    carrier.frequency.value = this.mod.carrier_freq || 220;

    modulator.frequency.value = this.mod.modulator_freq || 10;        //modulation frequency
    d.gain.value = this.mod.d_gain || 40;                            //modulation index "i" = d / mod_freq = 4 ==> 5 partials

    c_g.gain.value = this.mod.c_gain || .8;
    modulator
        .connect(d)
        .connect(carrier.frequency);    //"audio signals from the outputs of AudioNodes can be connected to an AudioParam, ***summing*** 
    //with the intrinsic parameter value."
    //check https://webaudio.github.io/web-audio-api/#AudioParam

    carrier
        .connect(c_g);
    
    if (!this.mod.floating_mod) {
        carrier.connect(master_g);
    }

    Object.assign(this.mod, {
        carrier, c_g, modulator, d,
        change_i: (ratio, mod_freq) => {
            modulator.frequency.value = mod_freq || modulator.frequency.value;
            d.gain.value = modulator.frequency.value * ratio;
        },
        change_i_exp: (ratio, t_secs, mod_freq) => {
            modulator.frequency.value = mod_freq || modulator.frequency.value;
            let _g = modulator.frequency.value * ratio;
            d.gain.cancelScheduledValues(ctx.currentTime);
            d.gain.setValueAtTime(d.gain.value, ctx.currentTime);
            d.gain.exponentialRampToValueAtTime(_g, ctx.currentTime + t_secs);
        },
        change_pitch: (c_freq) => {
            carrier.frequency.value = c_freq;

            //to find the new modulator freq which respects the frequency ratio we'll use
            //carrier_f / modulator_f = new_carrier_f / x
            modulator.frequency.value = (c_freq * modulator.frequency.value) / carrier.frequency.value;
        },
        change_pitch_exp: (c_freq, t_secs) => {
            carrier.frequency.setValueAtTime(carrier.frequency.value, ctx.currentTime);
            carrier.frequency.exponentialRampToValueAtTime(c_freq, ctx.currentTime + t_secs);

            //to find the new modulator freq which respects the frequency ratio we'll use
            //carrier_f / modulator_f = new_carrier_f / x
            let mod_freq = (c_freq * modulator.frequency.value) / carrier.frequency.value;
            modulator.frequency.setValueAtTime(modulator.frequency.value, ctx.currentTime);
            modulator.frequency.exponentialRampToValueAtTime(mod_freq, ctx.currentTime + t_secs);
        }
    });

    window.FM = this.mod;
}
function _start(config) {
    const { carrier, modulator } = this.mod;
    [carrier, modulator].forEach(osc => osc.start());
}
function _stop(config) {
    const { carrier, modulator } = this.mod;
    [carrier, modulator].forEach(osc => osc.stop());
}