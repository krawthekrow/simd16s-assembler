const Utils = rootRequire('utils/Utils.js');
const CompileError = rootRequire('utils/CompileError.js');

module.exports = (ast, errors) => {
	Utils.mapStatements(ast, {
		gpu: (statement) => {
			statement.writeReg = statement.writeReg.val;
			statement.truthTable = statement.truthTable.val;
			statement.colour = statement.colour.val;
			const reg1 = statement.reg1;
			const reg2 = statement.reg2;
			delete statement.reg1;
			delete statement.reg2;
			statement.useRandom = reg1.regType == 'rand';
			if(!statement.useRandom){
				statement.reg1 = reg1.val;
				statement.bitshift = reg1.bitshiftAmt != 0;
				statement.coreshift = reg1.coreshiftAmt != 0;
				if(statement.bitshift){
					statement.bitshiftDir = (reg1.bitshiftAmt == 1) ? 1 : 0;
				}
				if(statement.coreshift){
					statement.coreshiftDir = (reg1.coreshiftAmt == 1) ? 1 : 0;
				}
			}
			statement.reg2Type = reg2.regType;
			switch(reg2.regType){
				case 'varying':
					statement.reg2 = reg2.val;
				break;
				case 'uniform':
					statement.uniformType = reg2.uniformType;
					statement.uniformReg = reg2.val;
				break;
				default:
					errors.push(CompileError.critical(
						'Unrecognised GPU command reg2 type -- ' + reg2.regType,
						reg2.loc
					));
					return null;
				break;
			}
			return statement;
		}
	});
}
