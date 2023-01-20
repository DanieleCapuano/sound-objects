import { AM } from "./mod/am";
import { RM } from './mod/rm';
import { FM } from './mod/fm';
import { FM_comp1 } from './inst/fm_comp1';

const ///////////
    MOD_MAP = {
        am: AM,
        rm: RM,
        fm: FM,
        fm_comp1: FM_comp1
    },
    mod_being_tested = 'fm_comp1';

const conf = {};
window.addEventListener('load', loaded);
function loaded() {
    const /////////////////////////// 
        mod = new MOD_MAP[mod_being_tested](),
        { init, start, stop } = mod;

    let STARTED = false;
    document.addEventListener('click', () => {
        if (!STARTED) {
            conf.ctx = conf.ctx || new AudioContext();
            conf.master_g = conf.master_g || conf.ctx.createGain();
            conf.master_g.connect(conf.ctx.destination);

            console.info("Init module...");
            init(conf);

            console.info("Starting module...");
            start(conf);
        }
        else {
            console.info("Stopping module...");
            stop(conf);
            conf.master_g.disconnect();
        }

        STARTED = !STARTED;
    });
}