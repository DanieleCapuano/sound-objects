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

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _mod_am__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mod/am */ \"./src/mod/am.js\");\n/* harmony import */ var _mod_rm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mod/rm */ \"./src/mod/rm.js\");\n/* harmony import */ var _mod_fm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mod/fm */ \"./src/mod/fm.js\");\n/* harmony import */ var _inst_fm_acim__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./inst/fm_acim */ \"./src/inst/fm_acim.js\");\n/* harmony import */ var _inst_fm_2c1m__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./inst/fm_2c1m */ \"./src/inst/fm_2c1m.js\");\n\n\n\n\n\nvar\n  ///////////\n  MOD_MAP = {\n    am: _mod_am__WEBPACK_IMPORTED_MODULE_0__.AM,\n    rm: _mod_rm__WEBPACK_IMPORTED_MODULE_1__.RM,\n    fm: _mod_fm__WEBPACK_IMPORTED_MODULE_2__.FM,\n    fm_acim: _inst_fm_acim__WEBPACK_IMPORTED_MODULE_3__.FM_acim,\n    fm_2c1m: _inst_fm_2c1m__WEBPACK_IMPORTED_MODULE_4__.FM_2c1m\n  },\n  mod_being_tested = 'fm_2c1m';\nvar conf = {};\nwindow.addEventListener('load', loaded);\nfunction loaded() {\n  /////////////////////////// \n  var mod = new MOD_MAP[mod_being_tested](),\n    init = mod.init,\n    start = mod.start,\n    stop = mod.stop;\n  var STARTED = false;\n  document.addEventListener('click', function () {\n    if (!STARTED) {\n      conf.ctx = conf.ctx || new AudioContext();\n      conf.master_g = conf.master_g || conf.ctx.createGain();\n      conf.master_g.connect(conf.ctx.destination);\n      console.info(\"Init module...\");\n      init(conf);\n      console.info(\"Starting module...\");\n      start(conf);\n    } else {\n      console.info(\"Stopping module...\");\n      stop(conf);\n      conf.master_g.disconnect();\n    }\n    STARTED = !STARTED;\n  });\n}\n\n//# sourceURL=webpack://sound-modules/./src/index.js?");

/***/ }),

/***/ "./src/inst/fm_2c1m.js":
/*!*****************************!*\
  !*** ./src/inst/fm_2c1m.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"FM_2c1m\": () => (/* binding */ FM_2c1m)\n/* harmony export */ });\n//2 Carriers and 1 Modulator\nvar FM_2c1m = _FM_2c1m;\nfunction _FM_2c1m(opts) {\n  Object.assign(this, {\n    mod: Object.assign({}, opts || {}),\n    init: _init.bind(this),\n    start: _start.bind(this),\n    stop: _stop.bind(this)\n  });\n}\n\n//additive carriers with independent modulators\n\nfunction _init(config) {\n  var ctx = config.ctx,\n    master_g = config.master_g;\n  var m = ctx.createOscillator(),\n    d = ctx.createGain(),\n    c1 = ctx.createOscillator(),\n    c2 = ctx.createOscillator(),\n    g = ctx.createGain();\n  m.frequency.value = 7;\n  d.gain.value = 40;\n  c1.frequency.value = 200;\n  c2.frequency.value = 40;\n  g.gain.value = .1;\n  m.connect(d);\n  d.connect(c1.frequency);\n  d.connect(c2.frequency);\n  c1.connect(g);\n  c2.connect(g.gain);\n  if (!this.mod.floating_mod) {\n    g.connect(master_g);\n  }\n  Object.assign(this.mod, {\n    m: m,\n    d: d,\n    c1: c1,\n    c2: c2,\n    g: g\n  });\n  window.FM_2c1m = this.mod;\n}\nfunction _start(config) {\n  var _this$mod = this.mod,\n    m = _this$mod.m,\n    c1 = _this$mod.c1,\n    c2 = _this$mod.c2;\n  [m, c1, c2].forEach(function (osc) {\n    return osc.start();\n  });\n}\nfunction _stop(config) {\n  var _this$mod2 = this.mod,\n    m = _this$mod2.m,\n    c1 = _this$mod2.c1,\n    c2 = _this$mod2.c2;\n  [m, c1, c2].forEach(function (osc) {\n    return osc.stop();\n  });\n}\n\n//# sourceURL=webpack://sound-modules/./src/inst/fm_2c1m.js?");

/***/ }),

/***/ "./src/inst/fm_acim.js":
/*!*****************************!*\
  !*** ./src/inst/fm_acim.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"FM_acim\": () => (/* binding */ FM_acim)\n/* harmony export */ });\n/* harmony import */ var _mod_fm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../mod/fm */ \"./src/mod/fm.js\");\n\n\n//ACIM - Additive Carriers and Independent Modulator\nvar FM_acim = _FM_acim;\nfunction _FM_acim(opts) {\n  Object.assign(this, {\n    mod: Object.assign({}, opts || {}),\n    init: _init.bind(this),\n    start: _start.bind(this),\n    stop: _stop.bind(this)\n  });\n}\n\n//additive carriers with independent modulators\n\nfunction _init(config) {\n  var ctx = config.ctx,\n    master_g = config.master_g;\n  var m1 = new _mod_fm__WEBPACK_IMPORTED_MODULE_0__.FM({\n      carrier_freq: 80,\n      modulator_freq: 20,\n      d_gain: 10,\n      floating_mod: true\n    }),\n    m2 = new _mod_fm__WEBPACK_IMPORTED_MODULE_0__.FM({\n      carrier_freq: 120,\n      modulator_freq: 22,\n      d_gain: 10,\n      floating_mod: true\n    }),\n    g = ctx.createGain();\n  m1.init(config);\n  m2.init(config);\n  m1.mod.c_g.connect(g);\n  m2.mod.c_g.connect(g.gain);\n  if (!this.mod.floating_mod) {\n    g.connect(master_g);\n  }\n  Object.assign(this.mod, {\n    m1: m1,\n    m2: m2\n  });\n  window.FM_acim = this.mod;\n}\nfunction _start(config) {\n  var _this = this;\n  Object.keys(this.mod).forEach(function (m_key) {\n    var m_n = _this.mod[m_key],\n      mod = m_n.mod,\n      carrier = mod.carrier,\n      modulator = mod.modulator;\n    [carrier, modulator].forEach(function (osc) {\n      return osc.start();\n    });\n  });\n}\nfunction _stop(config) {\n  var _this2 = this;\n  Object.keys(this.mod).forEach(function (m_key) {\n    var m_n = _this2.mod[m_key],\n      mod = m_n.mod,\n      carrier = mod.carrier,\n      modulator = mod.modulator;\n    [carrier, modulator].forEach(function (osc) {\n      return osc.stop();\n    });\n  });\n}\n\n//# sourceURL=webpack://sound-modules/./src/inst/fm_acim.js?");

/***/ }),

/***/ "./src/mod/am.js":
/*!***********************!*\
  !*** ./src/mod/am.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"AM\": () => (/* binding */ AM)\n/* harmony export */ });\nvar AM = _AM;\nfunction _AM(opts) {\n  Object.assign(this, {\n    mod: Object.assign({}, opts || {}),\n    init: _init.bind(this),\n    start: _start.bind(this),\n    stop: _stop.bind(this)\n  });\n}\nfunction _init(config) {\n  var ctx = config.ctx,\n    master_g = config.master_g;\n  var g = ctx.createGain(),\n    carrier = ctx.createOscillator(),\n    c_g = ctx.createGain(),\n    modulator = ctx.createOscillator(),\n    m_g = ctx.createGain();\n  carrier.frequency.value = 220;\n  modulator.frequency.value = 10;\n  c_g.gain.value = .8;\n  modulator.connect(m_g).connect(c_g.gain); //\"audio signals from the outputs of AudioNodes can be connected to an AudioParam, ***summing*** \n  //with the intrinsic parameter value.\"\n  //check https://webaudio.github.io/web-audio-api/#AudioParam\n\n  carrier.connect(c_g).connect(g).connect(master_g);\n  Object.assign(this.mod, {\n    g: g,\n    carrier: carrier,\n    c_g: c_g,\n    modulator: modulator,\n    m_g: m_g\n  });\n  window.AM = this.mod;\n}\nfunction _start(config) {\n  var _this$mod = this.mod,\n    carrier = _this$mod.carrier,\n    modulator = _this$mod.modulator;\n  [carrier, modulator].forEach(function (osc) {\n    return osc.start();\n  });\n}\nfunction _stop(config) {\n  var _this$mod2 = this.mod,\n    carrier = _this$mod2.carrier,\n    modulator = _this$mod2.modulator;\n  [carrier, modulator].forEach(function (osc) {\n    return osc.stop();\n  });\n}\n\n//# sourceURL=webpack://sound-modules/./src/mod/am.js?");

/***/ }),

/***/ "./src/mod/fm.js":
/*!***********************!*\
  !*** ./src/mod/fm.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"FM\": () => (/* binding */ FM)\n/* harmony export */ });\nvar FM = _FM;\nfunction _FM(opts) {\n  Object.assign(this, {\n    mod: Object.assign({}, opts || {}),\n    init: _init.bind(this),\n    start: _start.bind(this),\n    stop: _stop.bind(this)\n  });\n}\nfunction _init(config) {\n  var ctx = config.ctx,\n    master_g = config.master_g;\n  var carrier = ctx.createOscillator(),\n    c_g = ctx.createGain(),\n    modulator = ctx.createOscillator(),\n    d = ctx.createGain(); //frequency deviation\n\n  carrier.frequency.value = this.mod.carrier_freq || 220;\n  modulator.frequency.value = this.mod.modulator_freq || 10; //modulation frequency\n  d.gain.value = this.mod.d_gain || 40; //modulation index \"i\" = d / mod_freq = 4 ==> 5 partials\n\n  c_g.gain.value = this.mod.c_gain || .8;\n  modulator.connect(d).connect(carrier.frequency); //\"audio signals from the outputs of AudioNodes can be connected to an AudioParam, ***summing*** \n  //with the intrinsic parameter value.\"\n  //check https://webaudio.github.io/web-audio-api/#AudioParam\n\n  carrier.connect(c_g);\n  if (!this.mod.floating_mod) {\n    carrier.connect(master_g);\n  }\n  Object.assign(this.mod, {\n    carrier: carrier,\n    c_g: c_g,\n    modulator: modulator,\n    d: d,\n    change_i: function change_i(ratio, mod_freq) {\n      modulator.frequency.value = mod_freq || modulator.frequency.value;\n      d.gain.value = modulator.frequency.value * ratio;\n    },\n    change_i_exp: function change_i_exp(ratio, t_secs, mod_freq) {\n      modulator.frequency.value = mod_freq || modulator.frequency.value;\n      var _g = modulator.frequency.value * ratio;\n      d.gain.cancelScheduledValues(ctx.currentTime);\n      d.gain.setValueAtTime(d.gain.value, ctx.currentTime);\n      d.gain.exponentialRampToValueAtTime(_g, ctx.currentTime + t_secs);\n    },\n    change_pitch: function change_pitch(c_freq) {\n      carrier.frequency.value = c_freq;\n\n      //to find the new modulator freq which respects the frequency ratio we'll use\n      //carrier_f / modulator_f = new_carrier_f / x\n      modulator.frequency.value = c_freq * modulator.frequency.value / carrier.frequency.value;\n    },\n    change_pitch_exp: function change_pitch_exp(c_freq, t_secs) {\n      carrier.frequency.setValueAtTime(carrier.frequency.value, ctx.currentTime);\n      carrier.frequency.exponentialRampToValueAtTime(c_freq, ctx.currentTime + t_secs);\n\n      //to find the new modulator freq which respects the frequency ratio we'll use\n      //carrier_f / modulator_f = new_carrier_f / x\n      var mod_freq = c_freq * modulator.frequency.value / carrier.frequency.value;\n      modulator.frequency.setValueAtTime(modulator.frequency.value, ctx.currentTime);\n      modulator.frequency.exponentialRampToValueAtTime(mod_freq, ctx.currentTime + t_secs);\n    }\n  });\n  window.FM = this.mod;\n}\nfunction _start(config) {\n  var _this$mod = this.mod,\n    carrier = _this$mod.carrier,\n    modulator = _this$mod.modulator;\n  [carrier, modulator].forEach(function (osc) {\n    return osc.start();\n  });\n}\nfunction _stop(config) {\n  var _this$mod2 = this.mod,\n    carrier = _this$mod2.carrier,\n    modulator = _this$mod2.modulator;\n  [carrier, modulator].forEach(function (osc) {\n    return osc.stop();\n  });\n}\n\n//# sourceURL=webpack://sound-modules/./src/mod/fm.js?");

/***/ }),

/***/ "./src/mod/rm.js":
/*!***********************!*\
  !*** ./src/mod/rm.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"RM\": () => (/* binding */ RM)\n/* harmony export */ });\nvar RM = _RM;\nfunction _RM(opts) {\n  return Object.assign(this, {\n    mod: Object.assign({}, opts || {}),\n    init: _init.bind(this),\n    start: _start.bind(this),\n    stop: _stop.bind(this)\n  });\n}\nfunction _init(config) {\n  var ctx = config.ctx,\n    master_g = config.master_g;\n  var carrier = ctx.createOscillator(),\n    c_g = ctx.createGain(),\n    modulator = ctx.createOscillator(),\n    m_g = ctx.createGain();\n  carrier.frequency.value = 220;\n  modulator.frequency.value = 10;\n  modulator.connect(m_g).connect(c_g);\n  carrier.connect(c_g).connect(master_g);\n  Object.assign(this.mod, {\n    carrier: carrier,\n    c_g: c_g,\n    modulator: modulator,\n    m_g: m_g\n  });\n  window.RM = this.mod;\n}\nfunction _start(config) {\n  var _this$mod = this.mod,\n    carrier = _this$mod.carrier,\n    modulator = _this$mod.modulator;\n  [carrier, modulator].forEach(function (osc) {\n    return osc.start();\n  });\n}\nfunction _stop(config) {\n  var _this$mod2 = this.mod,\n    carrier = _this$mod2.carrier,\n    modulator = _this$mod2.modulator;\n  [carrier, modulator].forEach(function (osc) {\n    return osc.stop();\n  });\n}\n\n//# sourceURL=webpack://sound-modules/./src/mod/rm.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;