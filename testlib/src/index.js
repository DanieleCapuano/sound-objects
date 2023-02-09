import { patches, instruments } from "soundo";

window.addEventListener('load', () => {
    console.info("LOADED", patches, instruments);

    Object.keys(patches).forEach(patch_name => {
        let p = patches[patch_name];

        console.info("PATCH", patch_name, p);
    });
});