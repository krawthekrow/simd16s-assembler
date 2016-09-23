const Utils = rootRequire('utils/Utils.js');
const CompileError = rootRequire('utils/CompileError.js');

module.exports = (ast, errors) => {
	const flattened = [];
	ast.labelsMap = {};
	function flattenTree(statement){
		if(statement == null){
			return;
		}
		switch(statement.type){
			case 'block':
				for(innerStatement of statement.statements){
					flattenTree(innerStatement);
				}
			break;
			case 'rep':
				for(let i = 0; i < statement.repNum.val; i++){
					flattenTree(statement.statement);
				}
			break;
			case 'label':
				if(statement.val in labelsMap){
					errors.push(CompileError.error(
						'Multiple declarations of label ' + statement.val + '.',
						statement.loc
					));
				}
				ast.labelsMap[statement.val] = labelsMap.length;
			break;
			case 'op':
				flattened.push(statement);
			break;
			case 'gpu':
				flattened.push(statement);
			break;
			default:
				errors.push(CompileError.critical(
					'Unrecognised statement type \'' + statement.type + '\' at tree flattening pass.'
				));
			break;
		}
	}
	flattenTree(ast);
	ast.statements = flattened;
}
