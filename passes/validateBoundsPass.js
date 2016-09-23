const Utils = rootRequire('utils/Utils.js');
const CompileError = rootRequire('utils/CompileError.js');
const Arch = rootRequire('arch/Arch.js');
const Format = rootRequire('arch/InstructionFormat.js');

const boundsInfo = {
	word: {
		lbound: Arch.WORD_MIN,
		ubound: Arch.WORD_MAX,
		name: 'word'
	},
	imm: {
		lbound: Format.IMM_MIN,
		ubound: Format.IMM_MAX,
		name: 'immediate value'
	},
	reg: {
		lbound: 0,
		ubound: Arch.NUM_REG,
		name: 'register'
	},
	gpuRegVarying: {
		lbound: 0,
		ubound: Arch.NUM_GPU_REG,
		name: 'GPU register'
	},
	gpuRegUniform: {
		lbound: 0,
		ubound: Arch.NUM_GPU_UNIFORM_REG,
		name: 'uniform register'
	},
	truthTable: {
		lbound: 0,
		ubound: 1 << 4,
		name: 'truth table'
	},
	colour: {
		lbound: 0,
		ubound: Arch.NUM_COLOUR_CHANNELS + 1,
		name: 'colour channel'
	}
};

module.exports = (ast, errors) => {
	function checkBounds(token, type){
		const bounds = boundsInfo[type];
		if(token.val < bounds.lbound || token.val >= bounds.ubound){
			errors.push(CompileError.error(
				'Out of bounds [' + bounds.lbound.toString() + ', ' + bounds.ubound.toString() + '] for ' + bounds.name.toString() + ' -- ' + token.val,
				token.loc
			));
			return false;
		}
		return true;
	};
	Utils.mapStatements(ast, {
		gpu: (statement) => {
			let valid = true;
			valid = valid && checkBounds(statement.writeReg, 'gpuRegVarying');
			valid = valid && checkBounds(statement.truthTable, 'truthTable');
			valid = valid && checkBounds(statement.colour, 'colour');
			if(!statement.useRandom){
				valid = valid && checkBounds(statement.reg1, (statement.reg1.regType == 'varying') ? 'gpuRegVarying' : 'gpuRegUniform');
			}
			valid = valid && checkBounds(statement.reg2, (statement.reg2.regType == 'varying') ? 'gpuRegVarying' : 'gpuRegUniform');
			return valid ? statement : null;
		},
		op: (statement) => {
			let valid = true;
			if(reg1 in statement){
				valid = valid && checkBounds(statement.reg1, 'reg');
			}
			if(imm in statement){
				valid = valid && checkBounds(statement.imm, 'imm');
			}
			return valid ? statement : null;
		},
		word: (statement) => {
			let valid = true;
			valid = valid && checkBounds(statement, 'word');
			return valid ? statement : null;
		}
	});
}

