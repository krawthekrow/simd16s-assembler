const fs = require('fs');

const charDict = JSON.parse(fs.readFileSync('utils/charDict.json', 'utf8'));

module.exports = charDict;
