export const get_docfrag = _get_docfrag;

function _get_docfrag(o, config, custom_get) {
    const { ctx } = config;
    let d = new DocumentFragment();

    Object.keys(o.opts).forEach(opt_key => {
        let opt_val = o.opts[opt_key];
        let pm = o.opts[opt_key + '_param'];
        if (!pm) //the called doesn't want this option to generate a dom control
            return;

        let container = document.createElement('div');
        container.classList.add('container');

        let label = document.createElement('div');
        label.classList.add('label');
        label.textContent = opt_key;

        let input = document.createElement('input');
        input.classList.add('input-val');
        input.setAttribute('type', 'number');
        input.setAttribute('min', '0');
        input.setAttribute('step', '0.1');
        input.value = opt_val;
        input.addEventListener('change', () => {
            let param = o.opts[opt_key + '_param'];
            if (!param) return;

            param.cancelScheduledValues(ctx.currentTime);
            param.setValueAtTime(input.value, ctx.currentTime);
        });

        container.appendChild(label);
        container.appendChild(input);
        d.appendChild(container);
    });

    if (custom_get) {
        d.appendChild(custom_get(o, config));
    }
    return d;
}