"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomhash = randomhash;
function randomhash(n) {
    const options = "fhefhksdagbfhgfohagoasgocnvcgnrwg2435u58643625654";
    const len = options.length;
    let hash = "";
    for (let i = 0; i < n; i++) {
        const index = Math.floor(Math.random() * len);
        hash += options[index];
    }
    return hash;
}
