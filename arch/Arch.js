class Arch {
};

Arch.NUM_REG = 16;
Arch.NUM_GPU_REG = 16;
Arch.NUM_GPU_UNIFORM_REG = 8;

Arch.NUM_COLOUR_CHANNELS = 3;

Arch.WORD_WIDTH = 29;
Arch.WORD_MASK = 1 << Arch.WORD_WIDTH;
Arch.WORD_UBOUND = 1 << (Arch.WORD_WIDTH - 1);
Arch.WORD_LBOUND = -(1 << (Arch.WORD_WIDTH - 1));

Arch.RAY_BIT = 0x20000000;

module.exports = Arch;
