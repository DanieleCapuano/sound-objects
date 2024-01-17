

export function node_exp_ramp(ctx, node, steps) {
    node.cancelScheduledValues(ctx.currentTime);
    node.setValueAtTime(node.value, ctx.currentTime);

    steps.forEach(step => {
        const { toval, time } = step;
        node.exponentialRampToValueAtTime(toval, ctx.currentTime + time);
    });
}

export function node_line_ramp(ctx, node, steps) {
    node.cancelScheduledValues(ctx.currentTime);
    node.setValueAtTime(node.value, ctx.currentTime);
    steps.forEach(step => {
        const { toval, time } = step;
        node.linearRampToValueAtTime(toval, ctx.currentTime + time);
    });
}