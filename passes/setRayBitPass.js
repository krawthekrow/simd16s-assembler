const Arch = rootRequire('arch/Arch.js');
module.exports = (ast, errors) => {
	for(const statement of ast.statements){
		switch(statement.type){
			case 'word':
				statement.val = statement.val | Arch.RAY_BIT;
			break;
		}
	}
};


