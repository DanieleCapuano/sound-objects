var express = require('express');
var fs = require('fs');
var app = express();

let port = process.env.PORT;
if (port == null || port == "") {
    port = 8082;
}

/*
    add_header 'Cross-Origin-Embedder-Policy' 'require-corp';
    add_header 'Cross-Origin-Opener-Policy' 'same-origin';
 */
const _get_index = (is_wasm, path, req) => {
    const res = path.res;
    res.set({
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin'
    });
    res.send(fs.readFileSync(is_wasm ? './wasm_worklet_test.html' : './index.html', 'utf8'));
};


app.get(("/"), _get_index);
app.get(("/wasm_worklet_test.html"), _get_index.bind(null, true));
app.get('/:file', function (req, res) {
    fs.readFile(req.params.file, (err, filetext) => {
        if (!err) {
            res.contentType(req.params.file);
            res.send(filetext);
        }
    });
});
app.use(express.static('.'));
// app.use(express.static('./dist'));
// app.use(express.static('./wasm-worklet'));

app.listen(port, () => { console.info("server listening to port " + port) });