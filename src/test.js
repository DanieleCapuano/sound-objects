import * as ops from './op';
import * as insts from './inst';

const conf = {};
window.addEventListener('load', loaded);
function loaded() {
    const start_bt = document.querySelector('.trigger-btn'),
        select_box = document.querySelector('.selector'),
        controls = document.querySelector('.controls');

    const MOD_MAP = Object.keys(ops).concat(Object.keys(insts)).reduce((o, key) => {
        o[key] = (ops[key] || insts[key]).default;
        return o;
    }, {});

    select_box.innerHTML = Object.keys(MOD_MAP)
        .map(mod_key => '<option value="' + mod_key + '">' + mod_key + '</option>')
        .join("");
    select_box.selectedIndex = 0;

    let mod = {},
        init = () => { },
        start = () => { },
        stop = () => { },
        onchange = () => {
            mod = new MOD_MAP[select_box.value]();
            init = mod.init;
            start = mod.start;
            stop = mod.stop;
        };
    select_box.addEventListener('change', onchange);
    onchange();

    let STARTED = false;
    let mg, ctx;
    start_bt.addEventListener('click', async () => {
        if (!STARTED) {
            conf.ctx = conf.ctx || new AudioContext();
            conf.master_g = conf.master_g || conf.ctx.createGain();

            conf.master_g.connect(conf.ctx.destination);
            conf.show_docfrag = true;
            conf.container = controls;

            mg = conf.master_g;
            ctx = conf.ctx;

            console.info("Init module " + select_box.value + "...");
            let doc_frag = init(conf);
            while (controls.firstChild) {
                controls.removeChild(controls.firstChild);
            }
            controls.appendChild(doc_frag);

            console.info("Starting module " + select_box.value + "...");
            mg.gain.setValueAtTime(0.0000001, ctx.currentTime);
            start(conf);
            mg.gain.exponentialRampToValueAtTime(1, ctx.currentTime + .25);
        }
        else {
            console.info("Stopping module " + select_box.value + "...");
            mg.gain.setValueAtTime(mg.gain.value, ctx.currentTime);
            mg.gain.exponentialRampToValueAtTime(.000000001, ctx.currentTime + .25);
            setTimeout(() => {
                stop(conf);
                conf.master_g.disconnect();
            }, 300);
        }

        STARTED = !STARTED;
        select_box.disabled = STARTED;
    });
}