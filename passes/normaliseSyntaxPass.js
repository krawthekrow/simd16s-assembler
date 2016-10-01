const Utils = rootRequire('utils/Utils.js');
const CompileError = rootRequire('utils/CompileError.js');

function normaliseSyntax(block, errors){
	Utils.mapStatements(block, {
		gpu: (statement) => {
			statement.colour = {
				type: 'int',
				format: 'dec',
				val: 0,
				loc: statement.loc
			};
			statement.flushScreenBuffer = false;
			statement.updateGraphicsBuffer = false;
			let nobufOverride = false;
			for(extension of statement.extensions){
				switch(extension.type){
					case 'colour':
						statement.colour = extension.channel;
					break;
					case 'flush':
						statement.flushScreenBuffer = true;
					break;
					case 'buf':
						statement.updateGraphicsBuffer = true;
					break;
					case 'nobuf':
						noBufOverride = true;
					break;
					default:
						errors.push(CompileError.critical(
							'Unrecognised GPU statement extension type -- ' + extension.type,
							extensions.loc
						));
					break;
				}
			}
			delete statement.extensions;
			if(statement.colour.val != 0 && !nobufOverride){
				statement.updateGraphicsBuffer = true;
			}
			return statement;
		}
	});
};

module.exports = (ast, errors) => {
	normaliseSyntax(ast, errors);
};
