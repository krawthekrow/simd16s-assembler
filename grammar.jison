%{
const getloc = (token) => {
	return {
		line: token.first_line,
		col: token.first_column
	};
};
%}

%lex
%options case-insensitive
%%

\s+				/* skip whitespace */

"macro"			return 'MACRO';
"alias"			return 'ALIAS';
"rep"			return 'REP';
"pad"			return 'PAD';

"genflags"		return 'GENFLAGS';
"savelp"		return 'SAVELP';

"gpu"			return 'GPU';
"rand"			return 'RAND';
"colour"|"color"			return 'COLOUR';
"flush"			return 'FLUSH';
"save"			return 'SAVE';

"print"			return 'PRINT';
"cleartext"		return 'CLEARTEXT';

"0x"[0-9]+		return 'LITERAL_INT_HEX';
"0b"[0-9]+		return 'LITERAL_INT_BIN';
[0-9]+			return 'LITERAL_INT_DEC';
\"((\\.)|[^\\"])*\"			return 'LITERAL_STR';

"r"[0-9]+		return 'LITERAL_REG';
"g"[0-9]+		return 'LITERAL_GPU_REG_VARYING';
"u"[0-9]+		return 'LITERAL_GPU_REG_UNIFORM';

[_a-zA-Z0-9]+	return 'IDENTIFIER';

"("				return '(';
")"				return ')';
"{"				return '{';
"}"				return '}';
"["				return '[';
"]"				return ']';
<<EOF>>			return 'EOF';
.				return 'INVALID';

/lex

%start start
%%

start
	: statements EOF
		{
			return {
				type: 'block',
				statements: $1,
				loc: getloc(@1)
			};
		}
	;

statements
	: %empty
		{
			$$ = [];
		}
	| statements statement
		{
			$$ = $1.concat([$2]);
		}
	;


statement
	: '{' statements '}'
		{
			$$ = {
				type: 'block',
				statements: $2,
				loc: getloc(@1)
			};
		}
	| REP constant_int statement
		{
			$$ = {
				type: 'rep',
				repNum: $2,
				statement: $3,
				loc: getloc(@1)
			};
		}
	| ALIAS identifier alias_to
		{
			$$ = {
				type: 'alias',
				from: $2,
				to: $3,
				loc: getloc(@1)
			};
		}
	| GPU gpu_reg gpu_reg_with_modifiers gpu_reg_with_modifiers constant_int gpu_statement_extensions
		{
			$$ = {
				type: 'gpu',
				writeReg: $2,
				reg1: $3,
				reg2: $4,
				truthTable: $5,
				extensions: $6,
				loc: getloc(@1)
			};
		}
	| PRINT reg constant_string
		{
			$$ = {
				type: 'print',
				reg: $2,
				printString: $3,
				loc: getloc(@1)
			};
		}
	| CLEARTEXT reg
		{
			$$ = {
				type: 'cleartext',
				reg: $2,
				loc: getloc(@1)
			};
		}
	;

alias_to
	: identifier
	| literal_reg
	| literal_gpu_reg
	| literal_int
	| literal_string
	| literal_gpu_reg_with_modifiers
	;


gpu_statement_extensions
	: %empty
		{
			$$ = [];
		}
	| gpu_statement_extensions gpu_statement_extension
		{
			$$ = $1.concat([$2]);
		}
	;

gpu_statement_extension
	: FLUSH
		{
			$$ = {
				type: 'flush',
				loc: getloc(@1)
			};
		}
	| COLOUR constant_int
		{
			$$ = {
				type: 'colour',
				channel: $2,
				loc: getloc(@1)
			};
		}
	| SAVE
		{
			$$ = {
				type: 'save',
				loc: getloc(@1)
			};
		}
	;


gpu_reg_with_modifiers
	: gpu_reg
	| literal_gpu_reg_with_modifiers
	;

gpu_reg
	: identifier
	| literal_gpu_reg
	;

reg
	: identifier
	| literal_reg
	;

constant_int
	: identifier
	| literal_int
	;

constant_string
	: identifier
	| literal_string
	;

identifier
	: IDENTIFIER
		{
			$$ = {
				type: 'identifier',
				val: yytext,
				loc: getloc(@1)
			};
		}
	;


literal_gpu_reg_with_modifiers
	: literal_gpu_reg '[' identifier ']'
		{
			$$ = {
				type: 'gpuRegWithModifiers',
				reg: $1,
				modifiers: $3,
				loc: getloc(@1)
			};
		}
	;

literal_gpu_reg
	: LITERAL_GPU_REG_VARYING
		{
			$$ = {
				type: 'gpuReg',
				regType: 'varying',
				val: parseInt(yytext.slice(1)),
				loc: getloc(@1)
			};
		}
	| LITERAL_GPU_REG_UNIFORM
		{
			$$ = {
				type: 'gpuReg',
				regType: 'uniform',
				val: parseInt(yytext.slice(1)),
				loc: getloc(@1)
			};
		}
	| RAND
		{
			$$ = {
				type: 'gpuReg',
				regType: 'rand',
				loc: getloc(@1)
			};
		}
	;

literal_reg
	: LITERAL_REG
		{
			$$ = {
				type: 'reg',
				val: parseInt(yytext.slice(1)),
				loc: getloc(@1)
			};
		}
	;

literal_int
	: LITERAL_INT_DEC
		{
			$$ = {
				type: 'int',
				format: 'dec',
				val: parseInt(yytext, 10),
				loc: getloc(@1)
			};
		}
	| LITERAL_INT_BIN
		{
			$$ = {
				type: 'int',
				format: 'bin',
				val: parseInt(yytext.slice(2), 2),
				loc: getloc(@1)
			};
		}
	| LITERAL_INT_HEX
		{
			$$ = {
				type: 'int',
				format: 'bin',
				val: parseInt(yytext.slice(2), 16),
				loc: getloc(@1)
			};
		}
	;

literal_string
	: LITERAL_STR
		{
			$$ = {
				type: 'string',
				val: yytext
					.slice(1, -1),
				loc: getloc(@1)
			};
		}
	;

