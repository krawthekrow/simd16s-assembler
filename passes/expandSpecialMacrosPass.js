const Utils = rootRequire('utils/Utils.js');
const charDict = rootRequire('utils/charDict.js');
const CompileError = rootRequire('utils/CompileError.js');
const Ops = rootRequire('utils/Ops.js');

const TEXT_CLEAR = 1 << 15;

module.exports = (ast, errors) => {
	Utils.mapStatements(ast, {
		print: (statement) => {
			const printStringToken = statement.printString;
			const printString = printStringToken.val;
			const chars = [];
			for(let i = 0; i < printString.length; i++){
				function getLoc(){
					return Utils.advanceCol(printStringToken.loc, i);
				};
				if(printString[i] == '\\'){
					if(i + 1 >= printString.length){
						errors.push(CompileError.critical(
							'Backslash at the end of string literal.',
							getLoc()
						));
						break;
					}
					const specialCharMatch = Object.keys(charDict.specialChars).find((charIdentifier) => {
						return printString.startsWith(charIdentifier, i + 1);
					});
					if(specialCharMatch !== undefined){
						chars.push(specialCharMatch);
						i += specialCharMatch.length;
						continue;
					}
				}
				else if(printString[i] in charDict.chars){
					chars.push(printString[i]);
				}
				else{
					errors.push(CompileError.error(
						'Character not recognised -- ' + printString[i] + '.',
						getLoc()
					));
				}
			}
			return {
				type: 'block',
				statements: chars.map((cchar) => {
					return Ops.send(
						statement.reg,
						parseInt(charDict.chars[cchar], 2),
						statement.loc
					);
				}),
				loc: statement.loc
			};
		},
		cleartext: (statement) => {
			return Ops.send(
				statement.reg,
				TEXT_CLEAR,
				statement.loc
			);
		}
	});
};
