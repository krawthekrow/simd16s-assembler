class Utils {
};

Utils.boolToInt = (val) => {
	return val ? 1 : 0;
};
Utils.advanceCol = (loc, advance) => {
	return {
		line: loc.line,
		col: loc.col + advance
	};
};
Utils.tokenToString = (token) => {
	switch(token.type){
		case 'identifier':
			return token.val;
		break;
		case 'int':
			switch(token.format){
				case 'dec':
					return token.val.toString();
				break;
				case 'bin':
					return '0b' + token.val.toString(2);
				break;
				case 'hex':
					return '0x' + token.val.toString(16);
				break;
			}
		break;
		case 'string':
			return '\"' + token.val + '\"';
		break;
		case 'reg':
			return 'r' + token.val.toString();;
		break;
		case 'gpuReg':
			switch(token.regType){
				case 'varying':
					return 'g' + token.val.toString();
				break;
				case 'uniform':
					return 'u' + token.val.toString();
				break;
				default:
					console.assert(false, 'Unrecognised GPU register type.');
				break;
			}
		break;
		case 'gpuRegWithModifiers':
			return Utils.tokenToString(token.reg) + '[' + token.modifiers.val + ']';
		break;
		default:
			console.assert(false, 'Unrecognised token type.');
		break;
	}
};
Utils.tokenTypeToString = (token) => {
	switch(token.type){
		case 'identifier':
			return 'identifier';
		break;
		case 'int':
			return 'integer';
		break;
		case 'string':
			return 'string';
		break;
		case 'reg':
			return 'register';
		break;
		case 'gpuReg':
			switch(token.regType){
				case 'varying':
					return 'GPU register';
				break;
				case 'uniform':
					return 'uniform register';
				break;
				default:
					console.assert(false, 'Unrecognised GPU register type.');
				break;
			}
		break;
		case 'gpuRegWithModifiers':
			return Utils.tokenTypeToString(token.reg) + ' with modifiers';
		break;
		default:
			console.assert(false, 'Unrecognised token type.');
		break;
	}
};
Utils.clone = (token) => {
	switch(token.type){
		case 'identifier':
			return {
				type: 'identifier',
				val: token.val,
				loc: token.loc
			};
		break;
		case 'int':
			return {
				type: 'int',
				format: token.format,
				val: token.val,
				loc: token.loc
			};
		break;
		case 'reg':
			return {
				type: 'reg',
				val: token.val,
				loc: token.loc
			};
		break;
		case 'gpuReg':
			return {
				type: 'gpuReg',
				regType: token.regType,
				val: token.val,
				loc: token.loc
			};
		break;
		case 'string':
			return {
				type: 'string',
				val: token.val,
				loc: token.loc
			};
		break;
		default:
			console.assert(false, 'Unrecognised token type -- ' + token.type);
		break;
	}
};

const returnSelf = (obj) => {
	return obj;
};

const doNothing = () => {};

Utils.mapStatements = (statement, callbackDict, beginScope = doNothing, endScope = doNothing) => {
	if(statement == null){
		return null;
	}
	switch(statement.type){
		case 'block':
			beginScope();
			for([i, innerStatement] of statement.statements.entries()){
				statement.statements[i] = Utils.mapStatements(innerStatement, callbackDict, beginScope, endScope);
			}
			endScope();
		break;
		case 'rep':
			statement.statement = Utils.mapStatements(statement.statement, callbackDict, beginScope, endScope);
		break;
	}
	return (statement.type in callbackDict) ?
		callbackDict[statement.type](statement) :
		statement;
}

module.exports = Utils;
