

export function node_exp_ramp(ctx, node, toval, time) {
    node.cancelScheduledValues(ctx.currentTime);
    node.setValueAtTime(node.value, ctx.currentTime);
    node.exponentialRampToValueAtTime(toval, ctx.currentTime + time);
}

export function node_line_ramp(ctx, node, toval, time) {
    node.cancelScheduledValues(ctx.currentTime);
    node.setValueAtTime(node.value, ctx.currentTime);
    node.linearRampToValueAtTime(toval, ctx.currentTime + time);
}