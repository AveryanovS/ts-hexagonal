const flake = require('simpleflake');

flake.options.epoch = Date.UTC(2019, 0, 1);

export function simpleflake() {
    return flake().toString('base58');
}
