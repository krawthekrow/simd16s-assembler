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
		case 'gpuRegWithModifiers':
			return {
				type: 'gpuRegWithModifiers',
				reg: Utils.clone(token.reg),
				modifiers: Utils.clone(token.modifiers),
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
Utils.cloneStatement = (statement) => {
	if(statement == null){
		return null;
	}
	switch(statement.type){
		case 'block':
			return {
				type: 'block',
				statements: statement.statements.map((innerStatement) => {
					return Utils.cloneStatement(innerStatement);
				}),
				loc: statement.loc
			};
		break;
		case 'label':
			return {
				type: 'label',
				name: statement.name,
				loc: statement.loc
			};
		break;
		case 'rep':
			return {
				type: 'rep',
				repNum: Utils.clone(statement.repNum),
				statement: Utils.cloneStatement(statement.statement),
				loc: statement.loc
			};
		break;
		case 'alias':
			return {
				type: 'alias',
				from: Utils.clone(statement.from),
				to: Utils.clone(statement.to),
				loc: statement.loc
			};
		break;
		case 'macro':
			return {
				type: 'macro',
				name: Utils.clone(statement.name),
				args: statement.args.map((arg) => {
					return Utils.clone(arg);
				}),
				statement: Utils.cloneStatement(statement.statement),
				loc: statement.loc
			};
		break;
		case 'procCall':
			return {
				type: 'procCall',
				name: Utils.clone(statement.name),
				args: statement.args.map((arg) => {
					return Utils.clone(arg);
				}),
				loc: statement.loc
			};
		break;
		case 'gpu':
			return {
				type: 'gpu',
				writeReg: Utils.clone(statement.writeReg),
				reg1: Utils.clone(statement.reg1),
				reg2: Utils.clone(statement.reg2),
				truthTable: Utils.clone(statement.truthTable),
				colour: Utils.clone(statement.colour),
				flushScreenBuffer: statement.flushScreenBuffer,
				updateGraphicsBuffer: statement.updateGraphicsBuffer,
				loc: statement.loc
			};
		break;
		case 'print':
			return {
				type: 'print',
				reg: Utils.clone(statement.reg),
				printString: Utils.clone(statement.printString),
				loc: statement.loc
			};
		break;
		case 'cleartext':
			return {
				type: 'cleartext',
				reg: Utils.clone(statement.reg),
				loc: statement.loc
			};
		break;
		default:
			console.assert(false, 'Unrecognised statement type -- ' + statement.type);
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
	const newStatement = (statement.type in callbackDict) ?
		callbackDict[statement.type](statement) :
		statement;
	if(newStatement == null){
		return null;
	}
	switch(newStatement.type){
		case 'block':
			beginScope();
			for([i, innerStatement] of newStatement.statements.entries()){
				newStatement.statements[i] = Utils.mapStatements(innerStatement, callbackDict, beginScope, endScope);
			}
			endScope();
		break;
		case 'rep':
			newStatement.statement = Utils.mapStatements(newStatement.statement, callbackDict, beginScope, endScope);
		break;
		case 'macro':
			newStatement.statement = Utils.mapStatements(newStatement.statement, callbackDict, beginScope, endScope);
	}
	return newStatement
}

module.exports = Utils;
