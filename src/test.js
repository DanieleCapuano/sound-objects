import { AM } from "./mod/am";
import { RM } from './mod/rm';
import { FM } from './mod/fm';
import { FM_acim } from './inst/fm_acim';
import { FM_2c1m } from './inst/fm_2c1m';

const ///////////
    MOD_MAP = {
        am: AM,
        rm: RM,
        fm: FM,
        fm_acim: FM_acim,
        fm_2c1m: FM_2c1m
    };

const conf = {};
window.addEventListener('load', loaded);
function loaded() {
    const start_bt = document.querySelector('.trigger-btn'),
        select_box = document.querySelector('.selector'),
        controls = document.querySelector('.controls');

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
    start_bt.addEventListener('click', () => {
        if (!STARTED) {
            conf.ctx = conf.ctx || new AudioContext();
            conf.master_g = conf.master_g || conf.ctx.createGain();
            conf.master_g.connect(conf.ctx.destination);

            mg = conf.master_g;
            ctx = conf.ctx;

            console.info("Init module...");
            let doc_frag = init(conf);
            while (controls.firstChild) {
                controls.removeChild(controls.firstChild);
            }
            controls.appendChild(doc_frag);

            console.info("Starting module...");
            mg.gain.setValueAtTime(0.0000001, ctx.currentTime);
            start(conf);
            mg.gain.exponentialRampToValueAtTime(1, ctx.currentTime + .25);
        }
        else {
            console.info("Stopping module...");
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