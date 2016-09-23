class InstructionFormat {
};

InstructionFormat.UPDATE_FLAGS_OFFSET = 28;
InstructionFormat.OPCODE_OFFSET = 22;

InstructionFormat.REG1_OFFSET = 18;
InstructionFormat.IMMREG_FLAG_OFFSET = 17;

InstructionFormat.IMM_OFFSET = 0;
InstructionFormat.IMM_WIDTH = 17;
InstructionFormat.IMM_MASK = 1 << InstructionFormat.IMM_WIDTH;
InstructionFormat.IMM_UBOUND = 1 << (InstructionFormat.IMM_WIDTH - 1);
InstructionFormat.IMM_LBOUND = -(1 << (InstructionFormat.IMM_WIDTH - 1));


InstructionFormat.GPU_UPDATE_GRAPHICS_BUFFER_FLAG_OFFSET = 28;
InstructionFormat.GPU_WRITE_REG_OFFSET = 0;
InstructionFormat.GPU_TRUTH_TABLE_OFFSET = 4;
InstructionFormat.GPU_REG2_OFFSET = 8;
InstructionFormat.GPU_UNIFORM_REG_OFFSET = 8;
InstructionFormat.GPU_UNIFORM_TYPE_OFFSET = 12;
InstructionFormat.GPU_UNIFORM_FLAG_OFFSET = 13;
InstructionFormat.GPU_RAND_FLAG_OFFSET = 14;
InstructionFormat.GPU_BITSHIFT_DIR_OFFSET = 14;
InstructionFormat.GPU_BITSHIFT_FLAG_OFFSET = 15;
InstructionFormat.GPU_CORESHIFT_DIR_OFFSET = 16;
InstructionFormat.GPU_CORESHIFT_FLAG_OFFSET = 17;
InstructionFormat.GPU_REG1_OFFSET = 18;
InstructionFormat.GPU_COLOUR_OFFSET = 22;
InstructionFormat.GPU_FLUSH_SCREEN_BUFFER_FLAG_OFFSET = 24;

module.exports = InstructionFormat;
