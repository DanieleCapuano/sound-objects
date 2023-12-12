export function ADSR_line(conf) {
    const { audioContext, node, startVal, a, d, s, r } = conf;
    node.cancelScheduledValues(audioContext.currentTime);
    node.setValueAtTime(startVal, audioContext.currentTime);
    [a, d, s, r].forEach((step, i, arr) => {
        const { val, tconst } = step;
        let tsum = arr.reduce((s, obj, j) => j <= i ? s + obj.time : s, 0);
        if (tconst) {
            node.setTargetAtTime(val || .00001, audioContext.currentTime + tsum, tconst)
        }
        else {
            node.linearRampToValueAtTime(val || .00001, audioContext.currentTime + tsum);
        }
    });
}

export function ADSR_exp(conf) {
    const { audioContext, node, startVal, a, d, s, r } = conf;
    node.cancelScheduledValues(audioContext.currentTime);
    node.setValueAtTime(startVal, audioContext.currentTime);
    [a, d, s, r].forEach((step, i, arr) => {
        const { val, tconst } = step;
        let tsum = arr.reduce((s, obj, j) => j <= i ? s + obj.time : s, 0);
        if (tconst) {
            node.setTargetAtTime(val || .00001, audioContext.currentTime + tsum, tconst)
        }
        else {
            node.exponentialRampToValueAtTime(val || .00001, audioContext.currentTime + tsum);
        }
    });
}

export function ADSR_custom(conf) {
    const { audioContext, node, startVal, a, d, s, r } = conf;
    node.cancelScheduledValues(audioContext.currentTime);
    node.setValueAtTime(startVal, audioContext.currentTime);
    node.exponentialRampToValueAtTime(a.val, audioContext.currentTime + a.time);
    node.exponentialRampToValueAtTime(d.val, audioContext.currentTime + a.time + d.time);
    node.setTargetAtTime(s.val, audioContext.currentTime + a.time + d.time + s.time, Math.exp(-(a.time + d.time + s.time)));
    node.exponentialRampToValueAtTime(r.val || .00001, audioContext.currentTime + a.time + d.time + s.time + r.time);
}