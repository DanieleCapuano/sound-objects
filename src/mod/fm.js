import { get_docfrag } from "../utils";

export const FM = _FM;

function _FM(opts) {
    Object.assign(this, {
        mod: {},
        opts: Object.assign({
            carrier_freq: 220,
            modulator_freq: 10,
            d_gain: 40,
            carrier_g: .8
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
        d = ctx.createGain();               //frequency deviation

    carrier.frequency.value = this.opts.carrier_freq;   //controlled by custom dom

    modulator.frequency.value = this.opts.modulator_freq;        //modulation frequency
    this.opts.modulator_freq_param = modulator.frequency;

    d.gain.value = this.opts.d_gain;                            //modulation index "i" = d / mod_freq ==> i+1 partials
    this.opts.d_gain_param = d.gain;

    c_g.gain.value = this.opts.carrier_g;
    this.opts.carrier_g_param = c_g.gain;

    modulator
        .connect(d)
        .connect(carrier.frequency);    //"audio signals from the outputs of AudioNodes can be connected to an AudioParam, ***summing*** 
    //with the intrinsic parameter value."
    //check https://webaudio.github.io/web-audio-api/#AudioParam

    carrier
        .connect(c_g)
        .connect(master_g); //this will be the passed output module

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
            //of course to prevent a change in modulation index we must change d as well keeping the old ratio
            let mod_freq = (c_freq * modulator.frequency.value) / carrier.frequency.value,
                ratio_tobe_kept = d.gain.value / modulator.frequency.value;
            this.mod.change_i(ratio_tobe_kept, mod_freq);
        },
        change_pitch_exp: (c_freq, t_secs) => {
            carrier.frequency.setValueAtTime(carrier.frequency.value, ctx.currentTime);
            carrier.frequency.exponentialRampToValueAtTime(c_freq, ctx.currentTime + t_secs);

            //to find the new modulator freq which respects the frequency ratio we'll use
            //carrier_f / modulator_f = new_carrier_f / x
            //of course to prevent a change in modulation index we must change d as well keeping the old ratio
            let mod_freq = (c_freq * modulator.frequency.value) / carrier.frequency.value,
                ratio_tobe_kept = d.gain.value / modulator.frequency.value;
            this.mod.change_i_exp(ratio_tobe_kept, t_secs, mod_freq);
        }
    });

    window.FM = this.mod;

    return get_docfrag(this, config, custom_docfrag_nodes);
}
function _start(config) {
    const { carrier, modulator } = this.mod;
    [carrier, modulator].forEach(osc => osc.start());
}
function _stop(config) {
    const { carrier, modulator } = this.mod;
    [carrier, modulator].forEach(osc => osc.stop());
}

function custom_docfrag_nodes(o, config) {
    let d = new DocumentFragment();

    const //////////////////////////
        _change_i_inputs = () => {
            let container = document.createElement('div');
            container.classList.add('container', 'container-opts', 'change-i');

            ['ratio', 'time'].forEach(opt => {
                let opt_cont = document.createElement('div');
                opt_cont.classList.add('opt-container', opt);

                let label = document.createElement('div');
                label.textContent = opt;

                let inp = document.createElement('input');
                inp.classList.add('input-val');

                inp.value = opt === 'ratio' ? o.mod.d.gain.value / o.mod.modulator.frequency.value : 0.0;

                inp.setAttribute('type', 'number');
                inp.setAttribute('min', '0');
                inp.setAttribute('step', opt === "time" ? '1' : '0.1');

                inp.addEventListener('change', () => {
                    let t = parseInt(document.querySelector('.change-i > .time > .input-val').value),
                        ratio_val = document.querySelector('.change-i > .ratio > .input-val').value,
                        mod_freq = o.mod.modulator.frequency.value;
                    o.mod[t ? "change_i_exp" : "change_i"](ratio_val, mod_freq, t);
                });

                opt_cont.appendChild(label);
                opt_cont.appendChild(inp);
                container.appendChild(opt_cont);
            });

            return container;
        },
        _change_pitch_inputs = () => {
            let container = document.createElement('div');
            container.classList.add('container', 'container-opts', 'change-pitch');

            ['carrier_freq', 'time'].forEach(opt => {
                let opt_cont = document.createElement('div');
                opt_cont.classList.add('opt-container', opt);

                let label = document.createElement('div');
                label.textContent = opt;

                let inp = document.createElement('input');
                inp.classList.add('input-val');

                inp.value = opt === 'carrier_freq' ? o.mod.carrier.frequency.value : 0.0;

                inp.setAttribute('type', 'number');
                inp.setAttribute('min', '0');
                inp.setAttribute('step', opt === 'time' ? '1' : '0.1');

                inp.addEventListener('change', () => {
                    let t = parseInt(document.querySelector('.change-pitch > .time > .input-val').value),
                        carrier_freq = o.mod.carrier.frequency.value;
                    o.mod[t ? "change_pitch_exp" : "change_pitch"](carrier_freq, t);
                });

                opt_cont.appendChild(label);
                opt_cont.appendChild(inp);
                container.appendChild(opt_cont);
            });

            return container;
        };

    ['change_i', 'change_pitch'].forEach(opt_key => {
        let container = document.createElement('div');
        container.classList.add('container');

        let label = document.createElement('div');
        label.classList.add('label');
        label.textContent = opt_key;

        let fn_container = opt_key === 'change_i' ? _change_i_inputs() : _change_pitch_inputs();

        container.appendChild(label);
        container.appendChild(fn_container);
        d.appendChild(container);
    });

    return d;
}