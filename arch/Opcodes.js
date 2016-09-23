class Opcodes {
};

const opcodesDict = {
	misc: 		0b00000,
	jmp:		0b00001,
	loop:		0b00010,
	bool:		0b00011,

	ld:			0b00100,
	st:			0b00101,
	send:		0b00110,

	ldr:		0b01000,
	str:		0b01001,
	
	push:		0b01100,
	pop:		0b01101,
	call:		0b01110,
	ret:		0b01111,

	mov:		0b10000,

	add:		0b10100,
	sub:		0b10101,
	addc:		0b10110,
	subc:		0b10111,

	shl:		0b11000,
	shr:		0b11001,
	sra:		0b11010,
	lsb:		0b11011,

	and:		0b11100,
	or:			0b11101,
	mask:		0b11110,
	xor:		0b11111
};

Opcodes.OPCODE_WIDTH = 5;

Opcodes.Mnemonics = new Array(1 << Opcodes.OPCODE_WIDTH).fill('reserved');

for(mnem of Object.keys(opcodesDict)){
	Opcodes[mnem.toUpperCase] = opcodesDict[mnem];
	Opcodes.Mnemonics[opcodesDict[mnem]] = mnem;
}

Opcodes.GPU = 0b11000;

module.exports = Opcodes;
