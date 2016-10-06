Assembler for the upcoming SIMD16S (an SIMD unit made in The Powder Toy). Still under development and very unstable.

Access SIMD16S [here](http://powdertoy.co.uk/Browse/View.html?ID=2046454). I have yet to make a controller for it, so it can only process GPU operations now.

See arch_docs.txt for sketchy details on the SIMD16S architecture (along with a lot of other future plans). See gpuTest.asm for an example of what code is presently supported by the assembler. That's the code used for the demo in the Powder Toy demo save.

To use:

1. Install [node](https://nodejs.org/en/).
2. `node assembler.js asm-file > bin-file`, where asm-file is the assembly code and bin-file is the file to output the machine code to. So, for example, `node assembler.js gpuTest.asm > gpuTest.bin`.
3. Use `loadProgram.lua` to load a program into the RAM. Enter `loadfile('loadProgram.lua')(x, y, filename)` into the Lua console, where (x, y) are the coordinates of the top-left corner of the RAM block, and filename is the name of the machine code file. So, for example, `loadfile('loadProgram.lua')(71, 112, 'gpuTest.bin')`
4. Don't complain about my using Javascript.
