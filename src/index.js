import * as mods from "./mod";
import * as insts from "./inst";

const patches = {};
const instruments = {};

Object.keys(mods).forEach(mod_key => { patches[mod_key] = mods[mod_key].default; });
Object.keys(insts).forEach(inst_key => { instruments[inst_key] = insts[inst_key].default; });

export { patches, instruments };
export default { patches, instruments };