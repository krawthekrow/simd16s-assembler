class Ops {
};

Ops.movc = (writeReg, val, loc) => {
	return {
		type: 'op',
		opcode: Ops.MOV,
		reg1: writeReg,
		imm: val,
		loc: loc
	};
};

Ops.sendc = (addrReg, val, loc) => {
	return {
		type: 'op',
		opcode: Ops.SEND,
		reg1: addrReg,
		imm: val,
		loc: loc
	};
};
