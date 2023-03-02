import { generate_osctype_enum, get_docfrag } from "../utils";

//WAVESHAPING!

export const WS = _WS;
export default WS;

function _WS(opts) {
    Object.assign(this, {
        mod: {},
        opts: Object.assign({
            carrier_freq: 220,
            carrier_type: 'sine',
            carrier_g: 1,
            shaping_amount: 4,
            shaping_harmonics: [.1, .1, .1, .1, .1],
            shaping_fn: 'distortion'
        }, opts || {}),
        init: _init.bind(this),
        start: _start.bind(this),
        stop: _stop.bind(this)
    });
}

function _init(config) {
    const { ctx, master_g } = config;

    let ws = ctx.createWaveShaper(),
        carrier = ctx.createOscillator(),
        c_g = ctx.createGain();

    carrier.frequency.value = this.opts.carrier_freq;
    this.opts.carrier_freq_param = carrier.frequency;

    carrier.type = this.opts.carrier_type;
    this.opts.carrier_type_enum = generate_osctype_enum(carrier);

    c_g.gain.value = this.opts.carrier_g;
    this.opts.carrier_g_param = c_g.gain;

    let cheby_n_harm = this.opts.shaping_harmonics.length,
        cheby_weights = this.opts.shaping_harmonics,
        cheby_amount = this.opts.shaping_amount;

    let ws_fns = {
        "distortion": {
            fn: distortion,
            set_args: ((f, val) => f.bind(null, parseFloat(val || this.opts.shaping_amount)))
        },
        "chebishev": {
            fn: chebyshev,
            set_args: ((f, val) => Object.assign(
                f.bind(null, cheby_n_harm, cheby_weights.map(n => n * (parseFloat(val || 1)))),
                Object.assign({}, chebyshev_data)
            ))
        }
    }
    let fn_def = ws_fns[this.opts.shaping_fn];
    ws.curve = make_curve(ctx, fn_def.set_args(fn_def.fn));

    this.opts.shaping_harmonics_enum = cheby_weights.map((w, i) => ({
        values: 'int',
        value: w,
        onchange: (val) => {
            cheby_weights[i] = parseFloat(val);
            ws.curve = make_curve(ctx, fn_def.set_args(fn_def.fn, cheby_amount))
        }
    }));

    this.opts.shaping_amount_enum = {
        values: 'int',
        onchange: (val) => {
            cheby_amount = parseFloat(val);
            ws.curve = make_curve(ctx, fn_def.set_args(fn_def.fn, cheby_amount));
        }
    };
    this.opts.shaping_fn_enum = {
        values: ['distortion', 'chebishev'],
        onchange: (val) => {
            fn_def = ws_fns[val];
            ws.curve = make_curve(ctx, fn_def.set_args(fn_def.fn, cheby_amount));
        }
    };

    carrier
        .connect(c_g)
        .connect(ws)
        .connect(master_g);

    Object.assign(this.mod, {
        carrier, c_g, ws
    });

    window.WS = this.mod;

    return config.show_docfrag ? get_docfrag(this, config) : this;
}

//////////////////////////////////////////////
//////////////////////////////////////////////
//Transfer functions
//////////////////////////////////////////////

function make_curve(ctx, fn) {
    const n_samples = ctx.sampleRate;
    let curve = new Float32Array(n_samples);

    fn.init_processing && fn.init_processing(fn);

    for (let i = 0; i < n_samples; i++) {
        const x = (i * 2) / n_samples - 1;  //   i / n_samples          in [0, 1]
        //  (i*2) / n_samples       in [0, 2]
        // ((i*2) / n_samples) - 1  in [-1, 1]
        curve[i] = fn(x);
        fn.step_processing && fn.step_processing(fn, curve[i]);
    }
    curve = (fn.post_processing ? fn.post_processing(fn, curve) : curve);

    return curve;
}

//see https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createWaveShaper#example
//x is in range [-1, 1]
function distortion(amount, x) {
    const /////////////////
        k = typeof amount === "number" ? amount : 50,
        deg = Math.PI / 180;

    return ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
}

//see https://kenny-peng.com/2022/06/18/chebyshev_harmonics.html
//x is in range [-1, 1]
function chebyshev(N, weights, x) {
    const /////////////////////////////////////////////
        f0 = (X) => {
            let res = chebyshev_poly(1, X);
            for (let n = 2; n < N + 2; n++) {
                res += weights[n - 2] * chebyshev_poly(n, X);
            }

            return res;
        },
        f1 = (X) => f0(X) - f0(0);

    return f1(x);
}
const chebyshev_data = {
    f1_max: Number.NEGATIVE_INFINITY,
    init_processing: (_this) => _this.f1_max = Number.NEGATIVE_INFINITY,
    step_processing: (_this, val) => _this.f1_max = Math.max(_this.f1_max, val),
    post_processing: (_this, f1_res) => {
        for (let i = 0; i < f1_res.length; i++) {
            f1_res[i] /= _this.f1_max;
        }
        return f1_res;
    }
};
function chebyshev_poly(n, x) {
    if (n === 0) return 1;
    if (n === 1) return x;
    return 2 * x * chebyshev_poly(n - 1, x) + chebyshev_poly(n - 2, x);
}

//////////////////////////////////////////////
//////////////////////////////////////////////


function _start(config) {
    const { carrier } = this.mod;
    carrier.start();
}
function _stop(config) {
    const { carrier } = this.mod;
    carrier.stop();
}