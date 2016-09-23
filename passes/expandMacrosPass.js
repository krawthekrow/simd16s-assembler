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

module.exports = (ast, errors) => {
	const aliasMap = new ScopedDict();
	const macrosMap = new ScopedDict();
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
	Utils.mapStatements(ast, {
		alias: (statement) => {
			aliasMap.add(statement.from.val, statement.to);
			return null;
		},
		macro: (statement) => {
			macrosMap.add(statement.name.val, statement);
			return null;
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
