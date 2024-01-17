import * as ops from "./op";
import * as insts from "./inst";
import { ADSR_line, ADSR_exp, ADSR_custom } from './lib/ADSR';
import Freeverb from "./lib/freeverb";
import * as utils from './lib/utils';

const operators = {};
const instruments = {};

Object.keys(ops).forEach(op_key => { operators[op_key] = ops[op_key].default; });
Object.keys(insts).forEach(inst_key => { instruments[inst_key] = insts[inst_key].default; });

export { operators, instruments, ADSR_line, ADSR_exp, ADSR_custom, Freeverb, utils };
export default { operators, instruments, ADSR_line, ADSR_exp, ADSR_custom, Freeverb, utils };