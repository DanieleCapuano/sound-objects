import { patches, instruments } from "soundo";

let testing = 'FMAcim';
let PLAYING = false;
window.addEventListener('load', () => {
    console.info("LOADED", patches, instruments);

    let p = (patches[testing] || instruments[testing]),
        P_inst,
        cfg = {};

    if (!p) console.warn('Object ' + testing + " not defined in library");

    const _playstop = () => {
        if (!PLAYING && p) {
            let ctx = new AudioContext(),
                master_g = ctx.createGain();

            master_g.connect(ctx.destination);
            P_inst = (new p()).init(Object.assign(cfg, { ctx, master_g }));
            P_inst.start(cfg);
        }
        else {
            P_inst.stop(cfg);
        }
        PLAYING = !!!PLAYING;
    };
    window.addEventListener('click', _playstop);
});