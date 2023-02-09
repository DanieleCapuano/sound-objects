/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/inst/FM_2c1m.js":
/*!*****************************!*\
  !*** ./src/inst/FM_2c1m.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"FM_2c1m\": () => (/* binding */ FM_2c1m),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ \"./src/utils.js\");\n\n\n//2 Carriers and 1 Modulator\nvar FM_2c1m = _FM_2c1m;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FM_2c1m);\nfunction _FM_2c1m(opts) {\n  Object.assign(this, {\n    mod: {},\n    opts: Object.assign({\n      modulator_freq: 7,\n      d_gain: 40,\n      carrier1_freq: 200,\n      carrier2_freq: 40,\n      carrier_g: .1\n    }, opts || {}),\n    init: _init.bind(this),\n    start: _start.bind(this),\n    stop: _stop.bind(this)\n  });\n}\n\n//additive carriers with independent modulators\n\nfunction _init(config) {\n  var ctx = config.ctx,\n    master_g = config.master_g;\n  var m = ctx.createOscillator(),\n    d = ctx.createGain(),\n    c1 = ctx.createOscillator(),\n    c2 = ctx.createOscillator(),\n    g = ctx.createGain();\n  m.frequency.value = this.opts.modulator_freq;\n  this.opts.modulator_freq_param = m.frequency;\n  d.gain.value = this.opts.d_gain;\n  this.opts.d_gain_param = d.gain;\n  c1.frequency.value = this.opts.carrier1_freq;\n  this.opts.carrier1_freq_param = c1.frequency;\n  c2.frequency.value = this.opts.carrier2_freq;\n  this.opts.carrier2_freq_param = c2.frequency;\n  g.gain.value = this.opts.carrier_g;\n  this.opts.carrier_g_param = g.gain;\n  m.connect(d);\n  d.connect(c1.frequency);\n  d.connect(c2.frequency);\n  c1.connect(g);\n  c2.connect(g.gain);\n  g.connect(master_g);\n  Object.assign(this.mod, {\n    m: m,\n    d: d,\n    c1: c1,\n    c2: c2,\n    g: g\n  });\n  window.FM_2c1m = this.mod;\n  return config.show_docfrag ? (0,_utils__WEBPACK_IMPORTED_MODULE_0__.get_docfrag)(this, config) : this;\n}\nfunction _start(config) {\n  var _this$mod = this.mod,\n    m = _this$mod.m,\n    c1 = _this$mod.c1,\n    c2 = _this$mod.c2;\n  [m, c1, c2].forEach(function (osc) {\n    return osc.start();\n  });\n}\nfunction _stop(config) {\n  var _this$mod2 = this.mod,\n    m = _this$mod2.m,\n    c1 = _this$mod2.c1,\n    c2 = _this$mod2.c2;\n  [m, c1, c2].forEach(function (osc) {\n    return osc.stop();\n  });\n}\n\n//# sourceURL=webpack://soundo/./src/inst/FM_2c1m.js?");

/***/ }),

/***/ "./src/inst/FM_acim.js":
/*!*****************************!*\
  !*** ./src/inst/FM_acim.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"FM_acim\": () => (/* binding */ FM_acim),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _mod_FM__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../mod/FM */ \"./src/mod/FM.js\");\n\n\n//ACIM - Additive Carriers and Independent Modulator\nvar FM_acim = _FM_acim;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FM_acim);\nfunction _FM_acim(opts) {\n  Object.assign(this, {\n    mod: {},\n    opts: Object.assign({\n      m1_carrier_freq: 80,\n      m1_modulatr_freq: 20,\n      m1_d_gain: 10,\n      m1_carrier_g: .8,\n      m2_carrier_freq: 120,\n      m2_modulator_freq: 22,\n      m2_d_gain: 10,\n      m2_carrier_g: .8,\n      inst_g: 1\n    }, opts || {}),\n    init: _init.bind(this),\n    start: _start.bind(this),\n    stop: _stop.bind(this)\n  });\n}\n\n//additive carriers with independent modulators\n\nfunction _init(config) {\n  var ctx = config.ctx,\n    master_g = config.master_g;\n  var\n    /////////////////////////////////\n    g = ctx.createGain(),\n    m1 = new _mod_FM__WEBPACK_IMPORTED_MODULE_0__.FM({\n      carrier_freq: this.opts.m1_carrier_freq,\n      modulator_freq: this.opts.m1_modulatr_freq,\n      d_gain: this.opts.m1_d_gain,\n      master_g: g,\n      show_docfrag: config.show_docfrag\n    }),\n    m2 = new _mod_FM__WEBPACK_IMPORTED_MODULE_0__.FM({\n      carrier_freq: this.opts.m2_carrier_freq,\n      modulator_freq: this.opts.m2_modulator_freq,\n      d_gain: this.opts.m2_d_gain,\n      master_g: g.gain,\n      show_docfrag: config.show_docfrag\n    });\n  g.gain.value = this.opts.inst_g;\n  var m1_docfrag = m1.init(config),\n    m2_docfrag = m2.init(config);\n  g.connect(master_g);\n  Object.assign(this.mod, {\n    m1: m1,\n    m2: m2\n  });\n  window.FM_acim = this.mod;\n  return config.show_docfrag ? get_docfrag_custom(this, config, m1_docfrag, m2_docfrag) : this;\n}\nfunction _start(config) {\n  var _this = this;\n  Object.keys(this.mod).forEach(function (m_key) {\n    var m_n = _this.mod[m_key],\n      mod = m_n.mod,\n      carrier = mod.carrier,\n      modulator = mod.modulator;\n    [carrier, modulator].forEach(function (osc) {\n      return osc.start();\n    });\n  });\n}\nfunction _stop(config) {\n  var _this2 = this;\n  Object.keys(this.mod).forEach(function (m_key) {\n    var m_n = _this2.mod[m_key],\n      mod = m_n.mod,\n      carrier = mod.carrier,\n      modulator = mod.modulator;\n    [carrier, modulator].forEach(function (osc) {\n      return osc.stop();\n    });\n  });\n}\nfunction get_docfrag_custom(o, config, m1_docfrag, m2_docfrag) {\n  var d = new DocumentFragment();\n  [m1_docfrag, m2_docfrag].forEach(function (df, i) {\n    var cont = document.createElement('div');\n    var m_i = i + 1;\n    cont.classList.add('main-container', 'opt-container', 'fm-acim', 'mod-' + m_i);\n    var l = document.createElement('div');\n    l.classList.add('label');\n    l.textContent = 'FM MOD ' + m_i;\n    cont.appendChild(l);\n    cont.appendChild(df);\n    d.appendChild(cont);\n  });\n  return d;\n}\n\n//# sourceURL=webpack://soundo/./src/inst/FM_acim.js?");

/***/ }),

/***/ "./src/mod/AM.js":
/*!***********************!*\
  !*** ./src/mod/AM.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"AM\": () => (/* binding */ AM),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ \"./src/utils.js\");\n\nvar AM = _AM;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AM);\nfunction _AM(opts) {\n  Object.assign(this, {\n    mod: {},\n    opts: Object.assign({\n      carrier_freq: 220,\n      modulator_freq: 10,\n      carrier_g: .8,\n      modulator_g: 2\n    }, opts || {}),\n    init: _init.bind(this),\n    start: _start.bind(this),\n    stop: _stop.bind(this)\n  });\n}\nfunction _init(config) {\n  var ctx = config.ctx,\n    master_g = config.master_g;\n  var g = ctx.createGain(),\n    carrier = ctx.createOscillator(),\n    c_g = ctx.createGain(),\n    modulator = ctx.createOscillator(),\n    m_g = ctx.createGain();\n  carrier.frequency.value = this.opts.carrier_freq;\n  this.opts.carrier_freq_param = carrier.frequency;\n  modulator.frequency.value = this.opts.modulator_freq;\n  this.opts.modulator_freq_param = modulator.frequency;\n  c_g.gain.value = this.opts.carrier_g;\n  this.opts.carrier_g_param = c_g.gain;\n  m_g.gain.value = this.opts.modulator_g;\n  this.opts.modulator_g_param = m_g.gain;\n  modulator.connect(m_g).connect(c_g.gain); //\"audio signals from the outputs of AudioNodes can be connected to an AudioParam, ***summing*** \n  //with the intrinsic parameter value.\"\n  //check https://webaudio.github.io/web-audio-api/#AudioParam\n\n  carrier.connect(c_g).connect(g).connect(master_g);\n  Object.assign(this.mod, {\n    g: g,\n    carrier: carrier,\n    c_g: c_g,\n    modulator: modulator,\n    m_g: m_g\n  });\n  window.AM = this.mod;\n  return config.show_docfrag ? (0,_utils__WEBPACK_IMPORTED_MODULE_0__.get_docfrag)(this, config) : this;\n}\nfunction _start(config) {\n  var _this$mod = this.mod,\n    carrier = _this$mod.carrier,\n    modulator = _this$mod.modulator;\n  [carrier, modulator].forEach(function (osc) {\n    return osc.start();\n  });\n}\nfunction _stop(config) {\n  var _this$mod2 = this.mod,\n    carrier = _this$mod2.carrier,\n    modulator = _this$mod2.modulator;\n  [carrier, modulator].forEach(function (osc) {\n    return osc.stop();\n  });\n}\n\n//# sourceURL=webpack://soundo/./src/mod/AM.js?");

/***/ }),

/***/ "./src/mod/FM.js":
/*!***********************!*\
  !*** ./src/mod/FM.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"FM\": () => (/* binding */ FM),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ \"./src/utils.js\");\n\nvar FM = _FM;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FM);\nfunction _FM(opts) {\n  Object.assign(this, {\n    mod: {},\n    opts: Object.assign({\n      carrier_freq: 220,\n      modulator_freq: 10,\n      d_gain: 40,\n      carrier_g: .8\n    }, opts || {}),\n    init: _init.bind(this),\n    start: _start.bind(this),\n    stop: _stop.bind(this)\n  });\n}\nfunction _init(config) {\n  var _this = this;\n  var ctx = config.ctx,\n    master_g = config.master_g;\n  var carrier = ctx.createOscillator(),\n    c_g = ctx.createGain(),\n    modulator = ctx.createOscillator(),\n    d = ctx.createGain(); //frequency deviation\n\n  carrier.frequency.value = this.opts.carrier_freq; //controlled by custom dom\n\n  modulator.frequency.value = this.opts.modulator_freq; //modulation frequency\n  this.opts.modulator_freq_param = modulator.frequency;\n  d.gain.value = this.opts.d_gain; //modulation index \"i\" = d / mod_freq ==> i+1 partials\n  this.opts.d_gain_param = d.gain;\n  c_g.gain.value = this.opts.carrier_g;\n  this.opts.carrier_g_param = c_g.gain;\n  modulator.connect(d).connect(carrier.frequency); //\"audio signals from the outputs of AudioNodes can be connected to an AudioParam, ***summing*** \n  //with the intrinsic parameter value.\"\n  //check https://webaudio.github.io/web-audio-api/#AudioParam\n\n  carrier.connect(c_g).connect(master_g); //this will be the passed output module\n\n  Object.assign(this.mod, {\n    carrier: carrier,\n    c_g: c_g,\n    modulator: modulator,\n    d: d,\n    change_i: function change_i(ratio, mod_freq) {\n      modulator.frequency.value = mod_freq || modulator.frequency.value;\n      d.gain.value = modulator.frequency.value * ratio;\n      return {\n        d_gain: d.gain.value\n      };\n    },\n    change_i_exp: function change_i_exp(ratio, mod_freq, t_secs) {\n      modulator.frequency.value = mod_freq || modulator.frequency.value;\n      var _g = modulator.frequency.value * ratio;\n      d.gain.cancelScheduledValues(ctx.currentTime);\n      d.gain.setValueAtTime(d.gain.value, ctx.currentTime);\n      d.gain.exponentialRampToValueAtTime(_g, ctx.currentTime + t_secs);\n      return {\n        d_gain: d.gain.value\n      };\n    },\n    change_pitch: function change_pitch(c_freq) {\n      carrier.frequency.value = c_freq;\n\n      //to find the new modulator freq which respects the frequency ratio we'll use\n      //carrier_f / modulator_f = new_carrier_f / x\n      //of course to prevent a change in modulation index we must change d as well keeping the old ratio\n      var mod_freq = c_freq * modulator.frequency.value / carrier.frequency.value,\n        ratio_tobe_kept = d.gain.value / modulator.frequency.value;\n      var _this$mod$change_i = _this.mod.change_i(ratio_tobe_kept, mod_freq),\n        d_gain = _this$mod$change_i.d_gain;\n      return {\n        mod_freq: mod_freq,\n        ratio_tobe_kept: ratio_tobe_kept,\n        d_gain: d_gain\n      };\n    },\n    change_pitch_exp: function change_pitch_exp(c_freq, t_secs) {\n      carrier.frequency.setValueAtTime(carrier.frequency.value, ctx.currentTime);\n      carrier.frequency.exponentialRampToValueAtTime(c_freq, ctx.currentTime + t_secs);\n\n      //to find the new modulator freq which respects the frequency ratio we'll use\n      //carrier_f / modulator_f = new_carrier_f / x\n      //of course to prevent a change in modulation index we must change d as well keeping the old ratio\n      var mod_freq = c_freq * modulator.frequency.value / carrier.frequency.value,\n        ratio_tobe_kept = d.gain.value / modulator.frequency.value;\n      var _this$mod$change_i_ex = _this.mod.change_i_exp(ratio_tobe_kept, mod_freq, t_secs),\n        d_gain = _this$mod$change_i_ex.d_gain;\n      return {\n        mod_freq: mod_freq,\n        ratio_tobe_kept: ratio_tobe_kept,\n        d_gain: d_gain\n      };\n    }\n  });\n  window.FM = this.mod;\n  return config.show_docfrag ? (0,_utils__WEBPACK_IMPORTED_MODULE_0__.get_docfrag)(this, config, custom_docfrag_nodes) : this;\n}\nfunction _start(config) {\n  var _this$mod = this.mod,\n    carrier = _this$mod.carrier,\n    modulator = _this$mod.modulator;\n  [carrier, modulator].forEach(function (osc) {\n    return osc.start();\n  });\n}\nfunction _stop(config) {\n  var _this$mod2 = this.mod,\n    carrier = _this$mod2.carrier,\n    modulator = _this$mod2.modulator;\n  [carrier, modulator].forEach(function (osc) {\n    return osc.stop();\n  });\n}\nfunction custom_docfrag_nodes(o, config) {\n  var d = new DocumentFragment();\n  var\n    //////////////////////////\n    _change_i_inputs = function _change_i_inputs() {\n      var container = document.createElement('div');\n      container.classList.add('container', 'container-opts', 'change-i');\n      ['ratio', 'time'].forEach(function (opt) {\n        var opt_cont = document.createElement('div');\n        opt_cont.classList.add('opt-container', opt);\n        var label = document.createElement('div');\n        label.textContent = opt;\n        var inp = document.createElement('input');\n        inp.classList.add('input-val');\n        inp.value = opt === 'ratio' ? o.mod.d.gain.value / o.mod.modulator.frequency.value : 0.0;\n        inp.setAttribute('type', 'number');\n        inp.setAttribute('min', '0');\n        inp.setAttribute('step', opt === \"time\" ? '1' : '0.1');\n        inp.addEventListener('change', function () {\n          var me_container = get_controls_div(container),\n            t = parseInt(me_container.querySelector('.change-i > .time > .input-val').value),\n            ratio_val = parseFloat(me_container.querySelector('.change-i > .ratio > .input-val').value),\n            d_input = me_container.querySelector('.d_gain > .input-val'),\n            mod_freq = o.mod.modulator.frequency.value;\n          var _o$mod = o.mod[t ? \"change_i_exp\" : \"change_i\"](ratio_val, mod_freq, t),\n            d_gain = _o$mod.d_gain;\n          d_input.value = d_gain;\n        });\n        opt_cont.appendChild(label);\n        opt_cont.appendChild(inp);\n        container.appendChild(opt_cont);\n      });\n      return container;\n    },\n    _change_pitch_inputs = function _change_pitch_inputs() {\n      var container = document.createElement('div');\n      container.classList.add('container', 'container-opts', 'change-pitch');\n      ['carrier_freq', 'time'].forEach(function (opt) {\n        var opt_cont = document.createElement('div');\n        opt_cont.classList.add('opt-container', opt);\n        var label = document.createElement('div');\n        label.textContent = opt;\n        var inp = document.createElement('input');\n        inp.classList.add('input-val');\n        inp.value = opt === 'carrier_freq' ? o.mod.carrier.frequency.value : 0.0;\n        inp.setAttribute('type', 'number');\n        inp.setAttribute('min', '0');\n        inp.setAttribute('step', opt === 'time' ? '1' : '0.1');\n        inp.addEventListener('change', function () {\n          var me_container = get_controls_div(container),\n            t = parseInt(me_container.querySelector('.change-pitch > .time > .input-val').value),\n            carrier_freq = parseFloat(me_container.querySelector('.change-pitch > .carrier_freq > .input-val').value),\n            i_ratio_input = me_container.querySelector('.change-i > .ratio > .input-val'),\n            mod_freq_input = me_container.querySelector('.modulator_freq > .input-val'),\n            d_input = me_container.querySelector('.d_gain > .input-val');\n          var _o$mod2 = o.mod[t ? \"change_pitch_exp\" : \"change_pitch\"](carrier_freq, t),\n            ratio_tobe_kept = _o$mod2.ratio_tobe_kept,\n            mod_freq = _o$mod2.mod_freq,\n            d_gain = _o$mod2.d_gain;\n          i_ratio_input.value = ratio_tobe_kept;\n          mod_freq_input.value = mod_freq;\n          d_input.value = d_gain;\n        });\n        opt_cont.appendChild(label);\n        opt_cont.appendChild(inp);\n        container.appendChild(opt_cont);\n      });\n      return container;\n    };\n  ['change_i', 'change_pitch'].forEach(function (opt_key) {\n    var container = document.createElement('div');\n    container.classList.add('container');\n    var label = document.createElement('div');\n    label.classList.add('label');\n    label.textContent = opt_key;\n    var fn_container = opt_key === 'change_i' ? _change_i_inputs() : _change_pitch_inputs();\n    container.appendChild(label);\n    container.appendChild(fn_container);\n    d.appendChild(container);\n  });\n  return d;\n}\nfunction get_controls_div(node) {\n  if (node.classList.contains('controls') || node.classList.contains('main-container')) return node;\n  return get_controls_div(node.parentElement);\n}\n\n//# sourceURL=webpack://soundo/./src/mod/FM.js?");

/***/ }),

/***/ "./src/mod/RM.js":
/*!***********************!*\
  !*** ./src/mod/RM.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"RM\": () => (/* binding */ RM),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ \"./src/utils.js\");\n\nvar RM = _RM;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RM);\nfunction _RM(opts) {\n  return Object.assign(this, {\n    mod: {},\n    opts: Object.assign({\n      carrier_freq: 220,\n      modulator_freq: 10,\n      carrier_g: .8,\n      modulator_g: 2\n    }, opts || {}),\n    init: _init.bind(this),\n    start: _start.bind(this),\n    stop: _stop.bind(this)\n  });\n}\nfunction _init(config) {\n  var ctx = config.ctx,\n    master_g = config.master_g;\n  var carrier = ctx.createOscillator(),\n    c_g = ctx.createGain(),\n    modulator = ctx.createOscillator(),\n    m_g = ctx.createGain();\n  carrier.frequency.value = this.opts.carrier_freq;\n  this.opts.carrier_freq_param = carrier.frequency;\n  modulator.frequency.value = this.opts.modulator_freq;\n  this.opts.modulator_freq_param = modulator.frequency;\n  c_g.gain.value = this.opts.carrier_g;\n  this.opts.carrier_g_param = c_g.gain;\n  m_g.gain.value = this.opts.modulator_g;\n  this.opts.modulator_g_param = m_g.gain;\n  modulator.connect(m_g).connect(c_g);\n  carrier.connect(c_g).connect(master_g);\n  Object.assign(this.mod, {\n    carrier: carrier,\n    c_g: c_g,\n    modulator: modulator,\n    m_g: m_g\n  });\n  window.RM = this.mod;\n  return config.show_docfrag ? (0,_utils__WEBPACK_IMPORTED_MODULE_0__.get_docfrag)(this, config) : this;\n}\nfunction _start(config) {\n  var _this$mod = this.mod,\n    carrier = _this$mod.carrier,\n    modulator = _this$mod.modulator;\n  [carrier, modulator].forEach(function (osc) {\n    return osc.start();\n  });\n}\nfunction _stop(config) {\n  var _this$mod2 = this.mod,\n    carrier = _this$mod2.carrier,\n    modulator = _this$mod2.modulator;\n  [carrier, modulator].forEach(function (osc) {\n    return osc.stop();\n  });\n}\n\n//# sourceURL=webpack://soundo/./src/mod/RM.js?");

/***/ }),

/***/ "./src/test.js":
/*!*********************!*\
  !*** ./src/test.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _mod_AM__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mod/AM */ \"./src/mod/AM.js\");\n/* harmony import */ var _mod_RM__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mod/RM */ \"./src/mod/RM.js\");\n/* harmony import */ var _mod_FM__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mod/FM */ \"./src/mod/FM.js\");\n/* harmony import */ var _inst_FM_acim__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./inst/FM_acim */ \"./src/inst/FM_acim.js\");\n/* harmony import */ var _inst_FM_2c1m__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./inst/FM_2c1m */ \"./src/inst/FM_2c1m.js\");\n\n\n\n\n\nvar\n///////////\nMOD_MAP = {\n  AM: _mod_AM__WEBPACK_IMPORTED_MODULE_0__.AM,\n  RM: _mod_RM__WEBPACK_IMPORTED_MODULE_1__.RM,\n  FM: _mod_FM__WEBPACK_IMPORTED_MODULE_2__.FM,\n  FM_acim: _inst_FM_acim__WEBPACK_IMPORTED_MODULE_3__.FM_acim,\n  FM_2c1m: _inst_FM_2c1m__WEBPACK_IMPORTED_MODULE_4__.FM_2c1m\n};\nvar conf = {};\nwindow.addEventListener('load', loaded);\nfunction loaded() {\n  var start_bt = document.querySelector('.trigger-btn'),\n    select_box = document.querySelector('.selector'),\n    controls = document.querySelector('.controls');\n  select_box.innerHTML = Object.keys(MOD_MAP).map(function (mod_key) {\n    return '<option value=\"' + mod_key + '\">' + mod_key + '</option>';\n  }).join(\"\");\n  select_box.selectedIndex = 0;\n  var mod = {},\n    init = function init() {},\n    start = function start() {},\n    stop = function stop() {},\n    onchange = function onchange() {\n      mod = new MOD_MAP[select_box.value]();\n      init = mod.init;\n      start = mod.start;\n      stop = mod.stop;\n    };\n  select_box.addEventListener('change', onchange);\n  onchange();\n  var STARTED = false;\n  var mg, ctx;\n  start_bt.addEventListener('click', function () {\n    if (!STARTED) {\n      conf.ctx = conf.ctx || new AudioContext();\n      conf.master_g = conf.master_g || conf.ctx.createGain();\n      conf.master_g.connect(conf.ctx.destination);\n      conf.show_docfrag = true;\n      mg = conf.master_g;\n      ctx = conf.ctx;\n      console.info(\"Init module...\");\n      var doc_frag = init(conf);\n      while (controls.firstChild) {\n        controls.removeChild(controls.firstChild);\n      }\n      controls.appendChild(doc_frag);\n      console.info(\"Starting module...\");\n      mg.gain.setValueAtTime(0.0000001, ctx.currentTime);\n      start(conf);\n      mg.gain.exponentialRampToValueAtTime(1, ctx.currentTime + .25);\n    } else {\n      console.info(\"Stopping module...\");\n      mg.gain.setValueAtTime(mg.gain.value, ctx.currentTime);\n      mg.gain.exponentialRampToValueAtTime(.000000001, ctx.currentTime + .25);\n      setTimeout(function () {\n        stop(conf);\n        conf.master_g.disconnect();\n      }, 300);\n    }\n    STARTED = !STARTED;\n    select_box.disabled = STARTED;\n  });\n}\n\n//# sourceURL=webpack://soundo/./src/test.js?");

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"get_docfrag\": () => (/* binding */ get_docfrag)\n/* harmony export */ });\nvar get_docfrag = _get_docfrag;\nfunction _get_docfrag(o, config, custom_get) {\n  var ctx = config.ctx;\n  var d = new DocumentFragment();\n  Object.keys(o.opts).forEach(function (opt_key) {\n    var opt_val = o.opts[opt_key];\n    var pm = o.opts[opt_key + '_param'];\n    if (!pm)\n      //the called doesn't want this option to generate a dom control\n      return;\n    var container = document.createElement('div');\n    container.classList.add('container', opt_key);\n    var label = document.createElement('div');\n    label.classList.add('label');\n    label.textContent = opt_key;\n    var input = document.createElement('input');\n    input.classList.add('input-val');\n    input.setAttribute('type', 'number');\n    input.setAttribute('min', '0');\n    input.setAttribute('step', '0.1');\n    input.value = opt_val;\n    input.addEventListener('change', function () {\n      var param = o.opts[opt_key + '_param'];\n      if (!param) return;\n      param.cancelScheduledValues(ctx.currentTime);\n      param.setValueAtTime(input.value, ctx.currentTime);\n    });\n    container.appendChild(label);\n    container.appendChild(input);\n    d.appendChild(container);\n  });\n  if (custom_get) {\n    d.appendChild(custom_get(o, config));\n  }\n  return d;\n}\n\n//# sourceURL=webpack://soundo/./src/utils.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/test.js");
/******/ 	
/******/ })()
;