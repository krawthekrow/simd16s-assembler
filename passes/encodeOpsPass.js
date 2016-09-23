const CompileError = rootRequire('utils/CompileError.js');
const Format = rootRequire('arch/InstructionFormat.js');
const Arch = rootRequire('arch/Arch.js');
const Opcodes = rootRequire('arch/Opcodes.js');
const Utils = rootRequire('utils/Utils.js');

module.exports = (ast, errors) => {
	for(const [i, statement] of ast.statements.entries()){
		if(statement == null){
			errors.push(CompileError.critical(
				'Null statement encountered after tree flattened.',
				ast.loc
			));
			continue;
		}
		switch(statement.type){
			case 'gpu':
			{
				let instruction = 0;
				instruction |= Opcodes.GPU << Format.OPCODE_OFFSET;
				instruction |= Utils.boolToInt(statement.updateGraphicsBuffer) << Format.GPU_UPDATE_GRAPHICS_BUFFER_FLAG_OFFSET;
				instruction |= Utils.boolToInt(statement.flushScreenBuffer) << Format.GPU_FLUSH_SCREEN_BUFFER_FLAG_OFFSET;
				instruction |= statement.colour << Format.GPU_COLOUR_OFFSET;
				instruction |= statement.writeReg << Format.GPU_WRITE_REG_OFFSET;
				instruction |= statement.truthTable << Format.GPU_TRUTH_TABLE_OFFSET;
				if(statement.useRandom){
					instruction |= 1 << Format.GPU_RAND_FLAG_OFFSET;
				}
				else{
					instruction |= statement.reg1 << Format.GPU_REG1_OFFSET;
					if(statement.coreshift){
						instruction |= 1 << Format.GPU_CORESHIFT_FLAG_OFFSET;
						instruction |= statement.coreshiftDir << Format.GPU_CORESHIFT_DIR_OFFSET;
					}
					if(statement.bitshift){
						instruction |= 1 << Format.GPU_BITSHIFT_FLAG_OFFSET;
						instruction |= statement.bitshiftDir << Format.GPU_BITSHIFT_DIR_OFFSET;
					}
				}
				if(statement.reg2Type == 'uniform'){
					console.assert(statement.uniformType == 'vertical' || statement.uniformType == 'horizontal');
					instruction |= 1 << Format.GPU_UNIFORM_FLAG_OFFSET;
					instruction |= Utils.boolToInt(statement.uniformType == 'vertical') << Format.GPU_UNIFORM_TYPE_OFFSET;
					instruction |= statement.uniformReg << Format.GPU_UNIFORM_REG_OFFSET;
				}
				else if(statement.reg2Type == 'varying'){
					instruction |= statement.reg2 << Format.GPU_REG2_OFFSET;
				}
				else{
					errors.push(CompileError.critical(
						'Invalid reg2 type -- ' + statement.reg2Type,
						statement.loc
					));
				}
				if(instruction < 0 || instruction > Arch.WORD_MAX){
					errors.push(CompileError.critical(
						'Instruction word out of bounds [0, ' + Arch.WORD_MAX.toString() + '] -- ' + instruction.toString(2),
						statement.loc
					));
					instruction = 0;
				}
				ast.statements[i] = {
					type: 'word',
					val: instruction,
					loc: statement.loc
				};
			}
			break;
			case 'op':
			{
				let instruction = 0;
				instruction |= opcode << Format.OPCODE_OFFSET;
				if(reg1 in statement){
					instruction |= statement.reg1 << REG1_OFFSET;
				}
				if(imm in statement){
					instruction |= (statement.imm & Format.IMM_MASK) << Format.IMM_OFFSET;
				}
				if(instruction < 0 || instruction > Arch.WORD_MAX){
					errors.push(CompileError.critical(
						'Instruction word out of bounds [0, ' + Arch.WORD_MAX.toString() + '] -- ' + instruction.toString(2),
						statement.loc
					));
					instruction = 0;
				}
				ast.statements[i] = {
					type: 'word',
					val: instruction,
					loc: statement.loc
				};
			}
			break;
			case 'word':
				statement.val &= Arch.WORD_MASK;
			break;
		}
	}
};
