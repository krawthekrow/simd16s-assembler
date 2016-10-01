const Utils = rootRequire('utils/Utils.js');
const CompileError = rootRequire('utils/CompileError.js');

class ScopedDict {
	constructor(){
		this.dict = {};
		this.scopeRecords = [];
	}
	beginScope(){
		this.scopeRecords.push([]);
	}
	endScope(){
		const record = this.scopeRecords.pop();
		for(const key of record){
			const nextNode = this.dict[key].next;
			if(nextNode == null){
				delete this.dict[key];
			}
			else{
				this.aliasMap[key] = nextNode;
			}
		}
	}
	add(key, val){
		this.scopeRecords[this.scopeRecords.length - 1].push(key);
		this.dict[key] = {
			val: val,
			next: (key in this.dict) ? this.dict[key] : null
		};
	}
	contains(key){
		return key in this.dict;
	}
	get(key){
		return this.dict[key].val;
	}
};

function normaliseGpuReg(reg){
	return (reg.type == 'gpuReg') ? {	
		type: 'gpuRegWithModifiers',
		reg: reg,
		modifiers: {
			type: 'identifier',
			val: '',
			loc: reg.loc
		},
		loc: reg.loc
	} : reg;
}

function expandMacros(block, errors, aliasMap, macrosMap){
	let uniqueLabelPrefix = 0;
	function expandToken(token){
		let res = token;
		if(res.type == 'identifier'){
			while(res.type == 'identifier' &&
				aliasMap.contains(res.val)){
				res = aliasMap.get(res.val);
			}
			res = Utils.clone(res);
			res.loc = token.loc;
		}
		if(res.type == 'gpuRegWithModifiers'){
			res.reg = expandToken(res.reg);
			res.modifiers = expandToken(res.modifiers);
		}
		return res;
	}
	function validateType(token, allowedTypes){
		if(allowedTypes.indexOf(token.type) == -1){
			switch(token.type){
				case 'identifier':
					errors.push(CompileError.undeclaredIdentifier(token));
				break;
				default:
					errors.push(CompileError.error(
						'Unexpected ' + Utils.tokenTypeToString(token) + ' in this location.',
						token.loc
					));
				break;
			}
			return false;
		}
		return true;
	}
	Utils.mapStatements(block, {
		alias: (statement) => {
			aliasMap.add(statement.from.val, statement.to);
			return null;
		},
		macro: (statement) => {
			macrosMap.add(statement.name.val, statement);
			return null;
		},
		procCall: (statement) => {
			statement.name = expandToken(statement.name);
			if(statement.name.type != 'identifier'){
				errors.push(CompileError.error(
					'Procedure call does not resolve to an identifier -- ' + Utils.tokenToString(statement.name),
					statement.name.loc
				));
				return null;
			}
			if(!macrosMap.contains(statement.name.val)){
				return statement;
			}
			const macro = macrosMap.get(statement.name.val);
			if(statement.args.length != macro.args.length){
				errors.push(CompileError.error(
					'Incorrect number of arguments -- Expected ' + macro.args.length.toString() + ', got ' + statement.args.length.toString()
				));
				return null;
			}
			const newStatement = Utils.cloneStatement(macro.statement);
			const macroAliases = [];
			for(let i = 0; i < macro.args.length; i++){
				macroAliases.push({
					type: 'alias',
					from: macro.args[i],
					to: statement.args[i],
					loc: statement.loc
				});
			}
			Utils.mapStatements(newStatement, {
				label: (innerStatement) => {
					const newLabel = uniqueLabelPrefix.toString() + '$' + innerStatement.name.val;
					macroAliases.push({
						type: 'alias',
						from: innerStatement.name.val,
						to: newLabel,
						loc: statement.loc
					});
					innerStatement.name.val = newLabel;
					return innerStatement;
				}
			});
			uniqueLabelPrefix++;
			const newStatementWithAliases = {
				type: 'block',
				statements: macroAliases.concat([newStatement]),
				loc: statement.loc
			};
			expandMacros(newStatementWithAliases, errors, aliasMap, macrosMap);
			return newStatementWithAliases;
		},
		rep: (statement) => {
			let valid = true;
			statement.repNum = expandToken(statement.repNum);
			valid = valid && validateType(statement.repNum, ['int']);
			return valid ? statement : null;
		},
		gpu: (statement) => {
			let valid = true;

			statement.writeReg = expandToken(statement.writeReg);
			valid = valid && validateType(statement.writeReg, ['gpuReg']);
			statement.truthTable = expandToken(statement.truthTable);
			valid = valid && validateType(statement.truthTable, ['int']);
			statement.colour = expandToken(statement.colour);
			valid = valid && validateType(statement.colour, ['int']);

			statement.reg1 = expandToken(statement.reg1);
			statement.reg1 = normaliseGpuReg(statement.reg1);
			valid = valid && validateType(statement.reg1, ['gpuRegWithModifiers']);
			statement.reg2 = expandToken(statement.reg2);
			statement.reg2 = normaliseGpuReg(statement.reg2);
			valid = valid && validateType(statement.reg2, ['gpuRegWithModifiers']);

			return valid ? statement : null;
		},
		print: (statement) => {
			let valid = true;
			statement.reg = expandToken(statement.reg);
			valid = valid && validateType(statement.reg, ['reg']);
			statement.printString = expandToken(statement.printString);
			valid = valid && validateType(statement.printString, ['string']);
			return valid ? statement : null;
		},
		cleartext: (statement) => {
			let valid = true;
			statement.reg = expandToken(statement.reg);
			valid = valid && validateType(statement.reg, ['reg']);
			return valid ? statement : null;
		}
	}, () => {
		aliasMap.beginScope();
		macrosMap.beginScope();
	}, () => {
		aliasMap.endScope();
		macrosMap.endScope();
	});
};

module.exports = (ast, errors) => {
	const aliasMap = new ScopedDict();
	const macrosMap = new ScopedDict();
	expandMacros(ast, errors, aliasMap, macrosMap);
};
