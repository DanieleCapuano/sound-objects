let ctx,
    main_g,
    notes,
    arpeggio_a,
    arpeggio_b,
    current_arpeggio,
    current_notes = [];

function main() {
    _init();

    arpeggio_a = [notes.A3, notes.C4, notes["C#4"], notes["D#4"], notes.E4, notes["A#5"], notes.C5, notes["C#5"], notes.E5];
    arpeggio_b = [notes.D4, notes["D#4"], notes.F4, notes["G4"], notes.A4, notes.D5, notes["D#5"], notes.C5, notes.F5, notes.D6, notes["D#6"]];
    current_arpeggio = arpeggio_a;
    current_notes = current_arpeggio.slice(0, 4);

    let IS = Array
        .from((new Array(9)).keys())
        .map(n => new INST(n)),
        delay = startDelay();

    IS.forEach((i, n, a) => {
        i.I.out.gain.value = 1 / (a.length);
        i.I.out.connect(main_g);

        delay.delays.forEach(dlo => i.I.out.connect(dlo.dl));
        setTimeout(i.start, Math.random() * 2000 + 500);
    });
    let itv = setInterval(() => {
        current_arpeggio = current_arpeggio === arpeggio_a ? arpeggio_b : arpeggio_a;
    }, 30000);
    document.addEventListener('click', () => {
        clearInterval(itv);
        ADSR_exp({
            node: main_g.gain,
            startVal: main_g.gain.value,
            a: { val: main_g.gain.value, time: .1 },
            d: { val: main_g.gain.value, time: .2 },
            s: { val: main_g.gain.value, time: .3 },
            r: { val: .000001, time: 20., tconst: 10 }
        });
    });

    main_g.gain.value = 1;
}

function startDelay() {
    let a = Array
        .from((new Array(6)).keys())
        .map(() => {
            const dl = ctx.createDelay(),
                dg = ctx.createGain();

            dl.delayTime.value = Math.random();
            dg.gain.value = Math.random() * .25;
            dl.connect(dg).connect(main_g);

            let t = Math.random() * 2000 + 1000,
                ts = t / 1000;
            setInterval(() => {
                dl.delayTime.setValueAtTime(dl.delayTime.value, ctx.currentTime);
                dl.delayTime.setTargetAtTime(Math.random(), ctx.currentTime + ts, Math.exp(ts));

                dg.gain.setValueAtTime(dg.gain.value, ctx.currentTime);
                dg.gain.exponentialRampToValueAtTime(Math.random() * .25, ts);
            }, t);
            return { dl, dg };
        });

    return {
        delays: a
    };
}
function __startDelay() {
    const offlineCtx = new OfflineAudioContext(2, 44100 * 40, 44100);

    main_g.connect(offlineCtx.destination);
    offlineCtx
        .startRendering()
        .then((renderedBuffer) => {
            console.log("Rendering completed successfully");
            const dd = ctx.createBufferSource(),
                ddg = ctx.createGain(),
                ddl = ctx.createDelay(5.);

            dd.buffer = renderedBuffer;
            ddg.gain.value = .2;

            dd
                .connect(ddl)
                .connect(ddg)
                .connect(ctx.destination);


            song.connect(audioCtx.destination);
        });

}

function INST(id) {
    this.id = id;
    let c = ctx.createOscillator(),
        m = ctx.createOscillator(),
        cg = ctx.createGain(),
        out = ctx.createGain(),
        mg = ctx.createGain(),
        lp = ctx.createBiquadFilter(),
        bp = ctx.createBiquadFilter(),
        hp = ctx.createBiquadFilter();

    c
        .connect(cg)
        .connect(lp)
        .connect(out);

    lp
        .connect(bp)
        .connect(hp)
        .connect(main_g);

    m
        .connect(mg)
        .connect(c.frequency);

    c.type = 'triangle';
    m.type = 'triangle';

    bp.type = 'bandpass';
    hp.type = 'highpass';

    const _play = (tms) => {
        let n = current_arpeggio[Math.round(Math.random() * (current_arpeggio.length - 1))];
        n = n || current_arpeggio[0];
        current_notes[this.id] = n;
        c.frequency.setValueAtTime(n, ctx.currentTime);
        const lasts = tms / 1000,
            rtime = 10;
        ADSR_exp({
            node: cg.gain,
            startVal: cg.gain.value,
            a: { val: .5, time: lasts * .01 },
            d: { val: .4, time: lasts * .3, tconst: 1.2 },
            s: { val: .4, time: lasts },
            r: { time: rtime }
        });
        ADSR_line({
            node: mg.gain,
            startVal: .01,
            a: { val: 5, time: lasts * .2 },
            d: { val: 40, time: lasts * .3, tconst: .2 },
            s: { val: 30, time: lasts },
            r: { val: .01, time: rtime }
        });
        ADSR_line({
            node: m.frequency,
            startVal: 1,
            a: { val: 8, time: 2 },
            d: { val: 10, time: 2.8, tconst: 1.2 },
            s: { val: 12, time: lasts },
            r: { val: 2, time: rtime }
        });
        ADSR_custom({
            node: lp.frequency,
            startVal: 600,
            a: { val: 200, time: .2 },
            d: { val: 90, time: .8 },
            s: { val: 120, time: lasts },
            r: { val: 20, time: rtime }
        });
        ADSR_custom({
            node: bp.frequency,
            startVal: 201,
            a: { val: 80, time: .2 },
            d: { val: 40, time: .8 },
            s: { val: 100, time: lasts },
            r: { val: 200, time: rtime }
        });
        ADSR_exp({
            node: bp.Q,
            startVal: 100,
            a: { val: 80, time: .2 },
            d: { val: 200, time: .8, tconst: 2.2 },
            s: { val: 800, time: lasts },
            r: { val: 100, time: rtime }
        });
        this.schedulePlay();
    };
    this.start = () => {
        this.schedulePlay();
        _play(Math.random() * 5000 + 5000);
        c.start();
        m.start();
    };
    this.schedulePlay = () => {
        let t = Math.random() * 5000 + 5000;
        setTimeout(_play.bind(null, t), t);
    }

    this.I = {
        ctx, main_g,
        m, c,
        mg, cg,
        out
    };
}

function ADSR_line(conf) {
    const { node, startVal, a, d, s, r } = conf;
    node.cancelScheduledValues(ctx.currentTime);
    node.setValueAtTime(startVal, ctx.currentTime);
    [a, d, s, r].forEach((step, i, arr) => {
        const { val, tconst } = step;
        let tsum = arr.reduce((s, obj, j) => j <= i ? s + obj.time : s, 0);
        if (tconst) {
            node.setTargetAtTime(val || .00001, ctx.currentTime + tsum, tconst)
        }
        else {
            node.linearRampToValueAtTime(val || .00001, ctx.currentTime + tsum);
        }
    });
}

function ADSR_exp(conf) {
    const { node, startVal, a, d, s, r } = conf;
    node.cancelScheduledValues(ctx.currentTime);
    node.setValueAtTime(startVal, ctx.currentTime);
    [a, d, s, r].forEach((step, i, arr) => {
        const { val, tconst } = step;
        let tsum = arr.reduce((s, obj, j) => j <= i ? s + obj.time : s, 0);
        if (tconst) {
            node.setTargetAtTime(val || .00001, ctx.currentTime + tsum, tconst)
        }
        else {
            node.exponentialRampToValueAtTime(val || .00001, ctx.currentTime + tsum);
        }
    });
}

function ADSR_custom(conf) {
    const { node, startVal, a, d, s, r } = conf;
    node.cancelScheduledValues(ctx.currentTime);
    node.setValueAtTime(startVal, ctx.currentTime);
    node.exponentialRampToValueAtTime(a.val, ctx.currentTime + a.time);
    node.exponentialRampToValueAtTime(d.val, ctx.currentTime + a.time + d.time);
    node.setTargetAtTime(s.val, ctx.currentTime + a.time + d.time + s.time, Math.exp(-(a.time + d.time + s.time)));
    node.exponentialRampToValueAtTime(r.val || .00001, ctx.currentTime + a.time + d.time + s.time + r.time);
}





function _init() {
    document.removeEventListener('click', main);
    ctx = new AudioContext();
    main_g = ctx.createGain();
    main_g.connect(ctx.destination);
    window.addEventListener('beforeunload', () => {
        let g = main_g.gain;
        g.setValueAtTime(g.value, ctx.currentTime);
        g.setTargetAtTime(.00000001, ctx.currentTime, .01);
    });
}
function onload() {
    fetch('/notes_hz.json')
        .then(buf => buf
            .json()
            .then(n => {
                notes = n;
                document.addEventListener('click', main);
                console.info("Click allowed");
            })
        );
}
window.addEventListener('load', onload);