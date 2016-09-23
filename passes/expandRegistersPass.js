const Utils = rootRequire('utils/Utils.js');
const CompileError = rootRequire('utils/CompileError.js');

function regMustBeReg1(reg){
	return (reg.regType == 'varying' && (reg.bitshiftAmt != 0 || reg.coreshiftAmt != 0)) ||
		reg.regType == 'rand';
}

function regMustBeReg2(reg){
	return reg.regType == 'uniform';
}

module.exports = (ast, errors) => {
	Utils.mapStatements(ast, {
		gpu: (statement) => {
			let regsValid = true;
			const expandModifiers = (regWithModifiers) => {
				const modifiersToken = regWithModifiers.modifiers;
				const modifiers = modifiersToken.val; 
				const reg = regWithModifiers.reg;
				switch(reg.regType){
					case 'rand':
						if(modifiers != ''){
							errors.push(CompileError.error(
								'Cannot apply shift modifications to rand.',
								modifiersToken.loc
							));
						}
					break;
					case 'varying':
						let bitshiftAmt = 0;
						let coreshiftAmt = 0;
						for(modifier of modifiers){
							switch(modifier){
								case 'l':
								case 'r':
									if(coreshiftAmt != 0){
										errors.push(CompileError.error(
											'Repeated horizontal shift modifier on' + Utils.tokenToString(reg) + '.',
											modifiersToken.loc
										));
									}
									coreshiftAmt = (modifier == 'l') ? -1 : 1;
								break;
								case 'u':
								case 'd':
									if(bitshiftAmt != 0){
										errors.push(CompileError.error(
											'Repeated vertical shift modifier on ' + Utils.tokenToString(reg) + '.',
											modifiersToken.loc
										));
									}
									bitshiftAmt = (modifier == 'u') ? -1 : 1;
								break;
								default:
									errors.push(CompileError.error(
										'Invalid modifier \'' + modifier + '\' on GPU register ' + Utils.regToString(reg) + '.',
										modifiersToken.loc
									));
								break;
							}
						}
						reg.bitshiftAmt = bitshiftAmt;
						reg.coreshiftAmt = coreshiftAmt;
					break;
					case 'uniform':
						switch(modifiers){
							case 'h':
								reg.uniformType = 'horizontal';
							break;
							case 'v':
								reg.uniformType = 'vertical';
							break;
							case '':
								errors.push(CompileError.error(
									'No specified direction modifier for GPU uniform.',
									reg.loc
								));
								regsValid = false;
							break;
							default:
								errors.push(CompileError.error(
									'Invalid modifier \'' + modifiers + '\' on uniform register ' + Utils.regToString(reg) + '.',
									reg.loc
								));
								regsValid = false;
							break;
						}
					break;
				}
			};
			expandModifiers(statement.reg1);
			expandModifiers(statement.reg2);
			const reg1 = statement.reg1.reg;
			const reg2 = statement.reg2.reg;
			if(!regsValid){
				return null;
			}
			const reg1MustBeReg1 = regMustBeReg1(reg1);
			const reg2MustBeReg1 = regMustBeReg1(reg2);
			const reg1MustBeReg2 = regMustBeReg2(reg1);
			const reg2MustBeReg2 = regMustBeReg2(reg2);
			if(reg1MustBeReg1 && reg2MustBeReg1){
				errors.push(CompileError.error(
					'Only one operand can be shifted or rand.',
					statement.loc
				));
				return null;
			}
			if(reg1MustBeReg2 && reg2MustBeReg2){
				errors.push(CompileError.error(
					'Only one operand can be a uniform.',
					statement.loc
				));
				return null;
			}
			const needSwap = reg1MustBeReg2 || reg2MustBeReg1;
			statement.reg1 = needSwap ? reg2 : reg1;
			statement.reg2 = needSwap ? reg1 : reg2;
			statement.truthTable.val ^= needSwap ? 6 : 0;
			return statement;
		}
	});
};

