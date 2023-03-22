export const get_docfrag = _get_docfrag;
export const update_docfrag = _update_docfrag;
export const generate_osctype_enum = _generate_osctype_enum;

function _get_docfrag(o, config, custom_get) {
    let d = new DocumentFragment();

    Object.keys(o.opts).forEach(opt_key => {

        let /////////////////////////////////////////////////
            container_param = _get_container(o, config, opt_key, 'param'),
            container_enum = _get_container(o, config, opt_key, 'enum');

        container_param && d.appendChild(container_param);
        container_enum && d.appendChild(container_enum);
    });

    if (custom_get) {
        d.appendChild(custom_get(o, config));
    }
    return d;
}

function _update_docfrag(docfrag, o, config, custom_get) {
    let d = docfrag || new DocumentFragment();

    Object.keys(o.opts).forEach(opt_key => {

        let /////////////////////////////////////////////////
            container_param = _get_container(o, config, opt_key, 'param'),
            container_enum = _get_container(o, config, opt_key, 'enum');

        container_param && d.appendChild(container_param);
        container_enum && d.appendChild(container_enum);
    });

    if (custom_get) {
        d.appendChild(custom_get(o, config));
    }
    return d;
}

function _get_container(o, config, opt_key, type) {
    const dom_fns = {
        param: _get_param_single_dom,
        enum: _get_enum_single_dom
    };

    let pm = o.opts[opt_key + '_' + type];
    if (!pm) //the called doesn't want this option to generate a dom control
        return null;

    let main_cont = document.createElement('div');
    main_cont.classList.add('container');
    pm = Array.isArray(pm) ? pm : [pm];
    pm.forEach((pm_el, i) => {
        let div = dom_fns[type](o, config, opt_key, pm_el, pm.length === 1 ? undefined : i);
        main_cont.appendChild(div);
    });

    return main_cont;
}


function _get_param_single_dom(o, config, opt_key, pm, i) {
    const { ctx } = config;
    let opt_opts = o.opts[opt_key];
    let opt_val = pm.value || opt_opts;
    if (typeof opt_val === 'object') opt_val = opt_val.value;

    let container = document.createElement('div');
    container.classList.add('container', 'param', opt_key);

    let label = document.createElement('div');
    label.classList.add('label');
    label.textContent = opt_key + (i !== undefined ? "-" + i : "");

    let input = document.createElement('input');
    input.classList.add('input-val');
    input.setAttribute('type', 'number');
    input.setAttribute('min', opt_opts.min || '0');
    if (opt_opts.max) {
        input.setAttribute('max', opt_opts.max);
    }
    input.setAttribute('step', opt_opts.step || '0.1');
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

function _get_enum_single_dom(o, config, opt_key, pm, i) {
    let opt_val = pm.value || o.opts[opt_key];
    let container = document.createElement('div');
    container.classList.add('container', 'enum', opt_key);

    let label = document.createElement('div');
    label.classList.add('label');
    label.textContent = opt_key + (i !== undefined ? "-" + i : "");;

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