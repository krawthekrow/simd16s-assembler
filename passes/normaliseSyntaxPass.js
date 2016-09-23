const Utils = rootRequire('utils/Utils.js');
const CompileError = rootRequire('utils/CompileError.js');

module.exports = (ast, errors) => {
	Utils.mapStatements(ast, {
		gpu: (statement) => {
			statement.colour = {
				type: 'int',
				val: 0,
				loc: statement.loc
			};
			statement.flushScreenBuffer = false;
			statement.updateGraphicsBuffer = false;
			for(extension of statement.extensions){
				switch(extension.type){
					case 'colour':
						statement.colour = extension.channel;
					break;
					case 'flush':
						statement.flushScreenBuffer = true;
					break;
					case 'save':
						statement.updateGraphicsBuffer = true;
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
			return statement;
		}
	});
};
