const keys = require('./choices/rps25.json');
const path = require('path');
const fs = require('fs');

const smartIndex = (arr, index) => {
    if (index > arr.length - 1) index -= arr.length - 1;

    if (index < 0) index += arr.length;

    return arr[index];
};

const outcomes = {};

for (var i = 0; i < keys.length; i++) {
    const key = keys[i];
    outcomes[key] = [];
    for (var j = 1; j < 13; j++) outcomes[key].push(smartIndex(keys, i - j));
}

fs.writeFileSync(path.join(__dirname, 'outcomes.json'), JSON.stringify(outcomes, null, 4));
