alias tt_AND 0b0001
alias tt_OR 0b0111
alias tt_XOR 0b0110
alias tt_XNOT 0b1001
alias tt_ALL 0b1111
alias tt_NONE 0b0000
alias tt_FIRST 0b0011
alias tt_SECOND 0b0101
alias tt_NOTFIRST 0b1100
alias tt_NOTSECOND 0b1010
alias tt_NOTFIRSTANDSECOND 0b0100
alias GREEN 1
alias BLUE 2
alias YELLOW 3

// test screen
gpu g0 g0 g0 tt_NONE colour 1
gpu g0 g0 g0 tt_NONE colour 2
gpu g0 g0 g0 tt_NONE colour 3 flush
gpu g1 g1 g1 tt_ALL colour 1 flush
gpu g0 g0 g0 tt_NONE colour 1 flush
gpu g1 g1 g1 tt_ALL colour 2 flush
gpu g0 g0 g0 tt_NONE colour 2 flush
gpu g1 g1 g1 tt_ALL colour 3 flush
gpu g0 g0 g0 tt_NONE colour 3 flush

// test shifts
gpu g2 g2 g2 tt_ALL colour 1 flush
rep 16 gpu g2 g2 g2[l] tt_SECOND colour 1 flush
gpu g2 g2 g2 tt_ALL colour 1 flush
rep 16 gpu g2 g2 g2[r] tt_SECOND colour 1 flush
gpu g2 g2 g2 tt_ALL colour 1 flush
rep 16 gpu g2 g2 g2[u] tt_SECOND colour 1 flush
gpu g2 g2 g2 tt_ALL colour 1 flush
rep 16 gpu g2 g2 g2[d] tt_SECOND colour 1 flush
gpu g2 g2 g2 tt_ALL colour 1 flush
rep 16 gpu g2 g2 g2[ul] tt_SECOND colour 1 flush
gpu g2 g2 g2 tt_ALL colour 1 flush
rep 16 gpu g2 g2 g2[ur] tt_SECOND colour 1 flush
gpu g2 g2 g2 tt_ALL colour 1 flush
rep 16 gpu g2 g2 g2[dl] tt_SECOND colour 1 flush
gpu g2 g2 g2 tt_ALL colour 1 flush
rep 16 gpu g2 g2 g2[dr] tt_SECOND colour 1 flush

// test rand
gpu g0 rand g0 tt_FIRST colour 1 flush

// test regs
gpu g1 g0 g0 tt_FIRST
gpu g2 g0 g0 tt_FIRST
gpu g3 g0 g0 tt_FIRST
gpu g4 g0 g0 tt_FIRST
gpu g5 g0 g0 tt_FIRST
gpu g6 g0 g0 tt_FIRST
gpu g7 g0 g0 tt_FIRST
gpu g8 g0 g0 tt_FIRST
gpu g9 g0 g0 tt_FIRST
gpu g10 g0 g0 tt_FIRST
gpu g11 g0 g0 tt_FIRST
gpu g12 g0 g0 tt_FIRST
gpu g13 g0 g0 tt_FIRST
gpu g14 g0 g0 tt_FIRST
gpu g15 g0 g0 tt_FIRST
gpu g1 g1 g1 tt_FIRST colour 1 flush
gpu g1 g1 g1 tt_NONE colour 1 flush
gpu g2 g2 g2 tt_FIRST colour 1 flush
gpu g2 g2 g2 tt_NONE colour 1 flush
gpu g3 g3 g3 tt_FIRST colour 1 flush
gpu g3 g3 g3 tt_NONE colour 1 flush
gpu g4 g4 g4 tt_FIRST colour 1 flush
gpu g4 g4 g4 tt_NONE colour 1 flush
gpu g5 g5 g5 tt_FIRST colour 1 flush
gpu g5 g5 g5 tt_NONE colour 1 flush
gpu g6 g6 g6 tt_FIRST colour 1 flush
gpu g6 g6 g6 tt_NONE colour 1 flush
gpu g7 g7 g7 tt_FIRST colour 1 flush
gpu g7 g7 g7 tt_NONE colour 1 flush
gpu g8 g8 g8 tt_FIRST colour 1 flush
gpu g8 g8 g8 tt_NONE colour 1 flush
gpu g9 g9 g9 tt_FIRST colour 1 flush
gpu g9 g9 g9 tt_NONE colour 1 flush
gpu g10 g10 g10 tt_FIRST colour 1 flush
gpu g10 g10 g10 tt_NONE colour 1 flush
gpu g11 g11 g11 tt_FIRST colour 1 flush
gpu g11 g11 g11 tt_NONE colour 1 flush
gpu g12 g12 g12 tt_FIRST colour 1 flush
gpu g12 g12 g12 tt_NONE colour 1 flush
gpu g13 g13 g13 tt_FIRST colour 1 flush
gpu g13 g13 g13 tt_NONE colour 1 flush
gpu g14 g14 g14 tt_FIRST colour 1 flush
gpu g14 g14 g14 tt_NONE colour 1 flush
gpu g15 g15 g15 tt_FIRST colour 1 flush
gpu g15 g15 g15 tt_NONE colour 1 flush

// setup for general test
gpu g1 rand g1 tt_FIRST

// setup for truth table test -- g2 = ones place, g3 = tens place
gpu g4 g4 g4 tt_ALL colour 1 flush
gpu g4 g4[d] g4 tt_NOTFIRST
gpu g2 g4[d] g4 tt_FIRST
gpu g3 g2[d] g2 tt_FIRST
gpu g2 g3[d] g2 tt_OR
gpu g3 g3[d] g3 tt_OR

// setup lower 12 bits mask
gpu g4 g4 g4 tt_ALL
rep 3 gpu g4 g4[d] g4 tt_FIRST
gpu g4 g4[d] g4 tt_FIRST colour 2 flush
gpu g4 g4 g4 tt_NONE

// test truth table
gpu g4 g3 g2 0 colour 1 flush
gpu g4 g3 g2 1 colour 1 flush
gpu g4 g3 g2 2 colour 1 flush
gpu g4 g3 g2 3 colour 1 flush
gpu g4 g3 g2 4 colour 1 flush
gpu g4 g3 g2 5 colour 1 flush
gpu g4 g3 g2 6 colour 1 flush
gpu g4 g3 g2 7 colour 1 flush
gpu g4 g3 g2 8 colour 1 flush
gpu g4 g3 g2 9 colour 1 flush
gpu g4 g3 g2 10 colour 1 flush
gpu g4 g3 g2 11 colour 1 flush
gpu g4 g3 g2 12 colour 1 flush
gpu g4 g3 g2 13 colour 1 flush
gpu g4 g3 g2 14 colour 1 flush
gpu g4 g3 g2 15 colour 1 flush

// general test
gpu g2 g2 g2 tt_NONE colour 1 flush
gpu g2 g2 g2 tt_NONE colour 2 flush
gpu g2 rand g2 tt_FIRST
gpu g3 g2 g2 tt_FIRST colour 1 flush
gpu g3 g3 g1 tt_AND colour 1 flush
gpu g3 g3 g0 tt_AND colour 1 flush
gpu g3 g3 g3 tt_NONE colour 1 flush
gpu g3 g2 g2 tt_FIRST colour 1 flush
gpu g3 g3 g1 tt_OR colour 1 flush
gpu g3 g3 g0 tt_OR colour 1 flush
gpu g3 g3 g3 tt_ALL colour 1 flush

//GoL
alias P g0
alias ones g1
alias twos g2
alias fours g3
alias temp g4
macro inc(c){
	gpu ones ones c tt_XOR
	gpu temp ones c tt_NOTFIRSTANDSECOND
	gpu twos twos temp tt_XOR
	gpu temp twos temp tt_NOTFIRSTANDSECOND
	gpu fours fours temp tt_OR // we don't care after it exceeds 3
}
gpu g0 g0 g0 tt_NONE colour 1 flush
gpu g0 g0 g0 tt_ALL colour 2 flush
gpu g0 rand g0 tt_FIRST colour 3 flush
rep 17 {
	gpu ones ones ones tt_NONE
	gpu twos twos twos tt_NONE
	gpu fours fours fours tt_NONE
	inc(P[ul])
	inc(P[u])
	inc(P[ur])
	inc(P[l])
	inc(P[r])
	inc(P[dl])
	inc(P[d])
	inc(P[dr])
	// the following is a compressed version of
	// P = (P & (cnt == 2 or 3)) | (~P & (cnt == 3))
	gpu temp P ones tt_OR
	gpu temp temp twos tt_AND
	gpu P fours temp tt_NOTFIRSTANDSECOND colour 3 flush
}
rep 8 gpu ones ones ones tt_FIRST
