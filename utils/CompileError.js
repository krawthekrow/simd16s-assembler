class CompileError {
	constructor(type, details, loc){
		this.type = type;
		this.details = details;
		this.loc = loc;
	}
	getOutputString(){
		return this.type == 'parse' ?
			this.details : (
				CompileError.ERROR_TYPE_OUTPUT_STRING[this.type] +
				((this.loc == null) ? '' : (
					' at ' + this.loc.line.toString() +
					':' + this.loc.col.toString()
				)) + ': ' + this.details
			);
	}
};

CompileError.ERROR_TYPE_OUTPUT_STRING = {
	critical: 'Critical Error',
	error: 'Error',
	warning: 'Warning'
};

CompileError.parse = (details) => {
	return new CompileError('parse', details, null);
}

CompileError.critical = (details, loc) => {
	return new CompileError('critical', details, loc);
}

CompileError.error = (details, loc) => {
	return new CompileError('error', details, loc);
}

CompileError.warning = (details, loc) => {
	return new CompileError('warning', details, loc);
}

CompileError.undeclaredIdentifier = (identifier) => {
	return CompileError.error('Undeclared identifier -- ' + identifier.val, identifier.loc);
}

CompileError.errorTypePriorityOrder = [
	'critical',
	'error',
	'warning'
];

CompileError.sortErrors = (errors) => {
	errors.sort((a, b) => {
		const priorityCmp = CompileError.errorTypePriorityOrder.indexOf(a.type) - CompileError.errorTypePriorityOrder.indexOf(b.type);
		const aLoc = (a.loc == null) ? {
			line: 1,
			col: 0
		} : a.loc;
		const bLoc = (b.loc == null) ? {
			line: 1,
			col: 0
		} : b.loc;
		const lineCmp = aLoc.line - bLoc.line;
		const colCmp = aLoc.col - bLoc.col;
		return (priorityCmp != 0) ? priorityCmp : (
				(lineCmp != 0) ? lineCmp : colCmp
		);
	});
};

module.exports = CompileError;
