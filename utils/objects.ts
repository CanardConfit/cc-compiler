export enum CompilerVersion {
    V05 = "Version 0.5",
    V1 = "Version 1.0",
}

export function getCompilerInfo(version: CompilerVersion) {
    return compilerInfo.find((el)=>el.id == version);
}

export const compilerInfo = [
    {id: CompilerVersion.V05, info: "This compiler only supports 8 variables from the register bank (R0, R1, ...). The ifs and whiles only accept the value of the ALU flags (N, Z, C, V). The interruption routine isn't supported."},
    {id: CompilerVersion.V1, info: "This compiler only supports 8 variables from the register bank (R0, R1, ...). The ifs support operations >, <, ==, !=, >=, <= between two registers. While only accept values from (N, Z, C, V) and true. Comments with // is supported. The interruption routine isn't supported. /!\\ Check the values of the jumps as there may be bugs that count the jumps wrong."}
]

export interface CCOptions {
    compilerVersion: CompilerVersion;
    interruptEnable: boolean;
    interruptPadding: number;
    loadProgram: number;
}

export const programs = [
        {id: 0, name: "V0.5 - Fibonacci Suite", program: `
R0 = 0
while true
{
    R1 = 0
    R2 = 1
    while not N
    {
        R3 = R1 + R0
        R1 = R2 + R0
        R2 = R2 + R3
    }
}
`},
        {id: 1, name: "V0.5 - If test Simple", program: `
R0 = 127
R1 = 127
R2 = R1 + R0

if not Z
{
    R3 = 1
}
R1 = 2
`},
    {id: 2, name: "V1 - If test Simple", program: `
R0 = 127
R1 = 127

if R0 == R1
{
    R3 = 1
}
`},
    {id: 3, name: "V1 - Load and Store", program: `
// -----
// Test whether the value of a peripheral variable is 30
// -----
R1 = 127

// Load data from R1 pointer with offset 5 into R2 var
LOAD R2 R1 5

// Test variable
R3 = 30

if R2 == R3
{
    R4 = 1
}
// Else
if R2 != R3
{
    R4 = 0
}

// Reassign pointer to store
R1 = 0

// Store result into RAM at 0x0
STORE R4 R1 0
`}, {id: 4, name: "V1 - UART registry into leds", program: `
// -----
// Get Value from UART
// -----

// Pointer to Perihperal part
R1 = 128

// Address of the wanted UART registry
R2 = 2

// Store address wanted into UART address peripheral
STORE R2 R1 2

while true
{
    // Load data incoming from UART registry selected
    LOAD R0 R1 3

    // Display value from UART to Leds
    STORE R0 R1 0
}
`}];

export enum TreeType {
    Entry, Assignation, While, IF, IF_SUB, IF_COND, IF_ELSE, ADD, SUB, DecG, DecD, DecA, AND, OR, NOT, START_BRACE, END_BRACE, STORE, LOAD, JUMP
}

export class Tree {
    public type;
    public next: Tree | null;
    public line: string;
    public weight;
    public fields: unknown[];
    public sub: Tree | null;

    constructor(line: string, tree_type: TreeType, fields: unknown[] = [], weight = 1) {
        this.type = tree_type;
        this.next = null;
        this.sub = null;
        this.weight = weight;
        this.line = line;
        this.fields = fields ?? [];
    }
}

export class CCLineAsm {
    public key: string;
    public value: string;

    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }
}

export class CCLine {
    public type: TreeType;
    public line: string;
    public opcode: string;
    public fields: CCLineAsm[];
    public weight: number;
    public asm: number;
    public subType: number;

    constructor(type: TreeType, line: string, opcode: string, fields: CCLineAsm[], weight: number, asm: number, subType: number = 0) {
        this.type = type;
        this.line = line;
        this.opcode = opcode;
        this.fields = fields;
        this.weight = weight;
        this.asm = asm;
        this.subType = subType;
    }
}

export const instructionInfo = [
    {id: TreeType.Assignation, info: "Assigning a value to a register."},
    {id: TreeType.While, info: "The while loop works with 2 instructions: If the condition is met, jump forward; otherwise, jump backward."},
    {id: TreeType.ADD, info: "ALU Operation. Addition of Rs0 and Rs1 to Rd."},
    {id: TreeType.SUB, info: "ALU Operation. Subtraction of Rs0 and Rs1 to Rd."},
    {id: TreeType.DecG, info: "ALU Operation. Left Shift of Rs0 and Rs1 to Rd."},
    {id: TreeType.DecD, info: "ALU Operation. Right Shift of Rs0 and Rs1 to Rd."},
    {id: TreeType.DecA, info: "ALU Operation. Arithmetic Shift of Rs0 and Rs1 to Rd."},
    {id: TreeType.AND, info: "ALU Operation. And bit by bit of Rs0 and Rs1 to Rd."},
    {id: TreeType.OR, info: "ALU Operation. Or bit by bit of Rs0 and Rs1 to Rd."},
    {id: TreeType.NOT, info: "ALU Operation. Not bit by bit of Rs0 to Rd."},
    {id: TreeType.IF_SUB, info: "If Operation. Subtracts right from left to test ALU flags."},
    {id: TreeType.IF_ELSE, info: "If Operation. Unconditional jump that takes in everything that didn't jump on the previous conditional jumps."},
    {id: TreeType.IF_COND, info: "If Operation. Conditional jump that checks whether one of the if conditions is satisfied. Can be inverted (so the “else” receives the “true” cases)."},
    {id: TreeType.LOAD, info: "Load Operation. Can load data from a pointer + offset pointed to a peripheral or RAM to a registry variable."},
    {id: TreeType.STORE, info: "Store Operation. Can store data from a registry variable to a pointer + offset pointed to a peripheral or RAM."},
    {id: TreeType.JUMP, info: "Jump unconditional relative."}
];

export function getInstructionInfo(type: TreeType) {
    return instructionInfo.find((el)=>el.id == type);
}
