Assembler for the upcoming SIMD16S (an SIMD unit made in The Powder Toy). Still under development and very unstable.

Access SIMD16S [here](http://powdertoy.co.uk/Browse/View.html?ID=2046454). I have yet to make a controller for it, so it can only process GPU operations now.

See arch_docs.txt for sketchy details on the SIMD16S architecture (along with a lot of other future plans). See gpuTest.asm for an example of what code is presently supported by the assembler. That's the code used for the demo in the Powder Toy demo save. Use loadProgram.lua to load a program into the RAM. Enter 'loadfile('loadProgram.lua')(x, y, filename)' into the Lua console, where (x, y) is the coordinates of the top-left corner of the RAM block, and filename is the name of your assembled machine code file.
