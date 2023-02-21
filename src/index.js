import * as ops from "./op";
import * as insts from "./inst";

const operators = {};
const instruments = {};

Object.keys(ops).forEach(op_key => { operators[op_key] = opts[op_key].default; });
Object.keys(insts).forEach(inst_key => { instruments[inst_key] = insts[inst_key].default; });

export { operators, instruments };
export default { operators, instruments };