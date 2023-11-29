# SoundO - A list of experiments about sound operators and instruments using Web Audio

**Currently implemented operators**
* AM 
* RM
* FM
* WS - WaveShaper
* ... (see src/op for more)

**Currently implemented instruments**
* FMAcim - [FM] Additive Carriers and Independent Modulator
* FM2c1m - [FM] Two carriers with a single modulator
* FM1c2m - [FM] One carrier with 2 parallel modulators
* FM1c2sm - [FM] One carrier with 2 serial modulators
* FMselfc - [FM] One carrier with a feedback loop to modulate its own frequency
* ... (see src/inst for more)

## Using worklet-based operator / instruments
You *should* build your own library before trying it out because the worklet files are dinamically generated and their names are currently not constant.

## Wasm worklets
To use wasm_worklets.js you need a custom web server because wasm worklets require SharedArrayBuffer which is not allowed anymore unless you set 

```
'Cross-Origin-Embedder-Policy': 'require-corp',
'Cross-Origin-Opener-Policy': 'same-origin'
```

headers on the top document. So the node-server.js is provided.

## How to build

```
npm run build
```

or

```
npm run watch
```

## How to run test
```
node node-server.js
```

Open your browser on
```
http://localhost:8082/index.html    //for normal test
```

```
http://localhost:8082/wasm_worklet_test.html    //for wasm worklet test
```


