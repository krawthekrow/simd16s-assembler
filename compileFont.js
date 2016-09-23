const fs = require('fs');

const fontData = fs.readFileSync('../fontdata.txt', 'utf8').split('\n');
const specialFontData = fs.readFileSync('../specialfontdata.txt', 'utf8').split('\n');

const SPECIAL_CHAR_IDENTIFIERS = [
	'BTN_UP',
	'BTN_LEFT',
	'BTN_RIGHT',
	'BTN_DOWN',
	'BTN_TRIANGLE',
	'BTN_SQUARE',
	'BTN_CIRCLE',
	'BTN_CROSS',
	'PT_WALL',
	'PT_ELECTRONICS',
	'PT_POWERED',
	'PT_SENSORS',
	'PT_FORCE',
	'PT_EXPLOSIVES',
	'PT_GASSES',
	'PT_LIQUID',
	'PT_POWDER',
	'PT_SOLIDS',
	'PT_RADIOACTIVE',
	'PT_SPECIAL',
	'PT_LIFE',
	'PT_TOOLS',
	'PT_FAVOURITES',
	'PT_DECORATION',
	'PT_SEARCH',
	'PT_STICKMAN'
];

const chars = {}, specialChars = {};
for(let i = 0; i < 95; i++){
	chars[String.fromCharCode(i + 32)] = fontData[i];
}
for(let i = 0; i < SPECIAL_CHAR_IDENTIFIERS.length; i++){
	chars[SPECIAL_CHAR_IDENTIFIERS[i]] = specialFontData[i];
	specialChars[SPECIAL_CHAR_IDENTIFIERS[i]] = specialFontData[i];
}
const charDict = {
	chars: chars,
	specialChars: specialChars
};

fs.writeFileSync('utils/charDict.json', JSON.stringify(charDict));
