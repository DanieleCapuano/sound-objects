export const get_docfrag = _get_docfrag;
export const generate_osctype_enum = _generate_osctype_enum;

function _get_docfrag(o, config, custom_get) {
    let d = new DocumentFragment();

    Object.keys(o.opts).forEach(opt_key => {

        let /////////////////////////////////////////////////
            container_param = _get_param_container(o, config, opt_key),
            container_enum = _get_enum_container(o, config, opt_key);

        container_param && d.appendChild(container_param);
        container_enum && d.appendChild(container_enum);
    });

    if (custom_get) {
        d.appendChild(custom_get(o, config));
    }
    return d;
}

function _get_param_container(o, config, opt_key) {
    const { ctx } = config;

    let opt_val = o.opts[opt_key];
    let pm = o.opts[opt_key + '_param'];
    if (!pm) //the called doesn't want this option to generate a dom control
        return null;

    let container = document.createElement('div');
    container.classList.add('container', 'param', opt_key);

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

    return container;
}

function _get_enum_container(o, config, opt_key) {
    let opt_val = o.opts[opt_key];
    let pm = o.opts[opt_key + '_enum'];
    if (!pm) //the called doesn't want this option to generate a dom control
        return null;

    let container = document.createElement('div');
    container.classList.add('container', 'enum', opt_key);

    let label = document.createElement('div');
    label.classList.add('label');
    label.textContent = opt_key;

    let input = null;
    if (pm.values === 'int') {
        input = document.createElement('input');
        input.classList.add('input-val');
        input.setAttribute('type', 'number');
        input.setAttribute('min', '0');
        input.setAttribute('step', '0.1');
        input.value = opt_val;
        input.addEventListener('change', () => {
            pm.onchange(input.value);
        });
    }
    else if (Array.isArray(pm.values)) {
        input = document.createElement('select');
        pm.values.forEach(val => {
            let opt = document.createElement('option');
            opt.value = val;
            opt.textContent = val;
            input.appendChild(opt);
        });
        input.addEventListener('change', () => {
            pm.onchange(input.value);
        });
    }

    if (!input) return null;
    
    container.appendChild(label);
    container.appendChild(input);
    return container;
}

function _generate_osctype_enum(o) {
    return {
        values: ['sine', 'triangle', 'square', 'sawtooth'],
        onchange: (val) => o.type = val
    };
}