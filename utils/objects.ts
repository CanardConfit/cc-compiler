export enum CompilerVersion {
    V05 = "Version 0.5",
    V1 = "Version 1.0",
}

export function getCompilerInfo(version: CompilerVersion) {
    return compilerInfo.find((el)=>el.id == version);
}

export const compilerInfo = [
    {id: CompilerVersion.V05, info: "This compiler only supports 8 variables from the register bank (R0, R1, ...). The ifs and whiles only accept the value of the ALU flags (N, Z, C, V). The interruption routine isn't supported."},
    {id: CompilerVersion.V1, info: ""}
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
`}];

export enum TreeType {
    Entry, Assignation, While, If, Add, Sub, DecG, DecD, DecA, AND, OR, NOT, Start_Brace, End_Brace, More
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

    constructor(type: TreeType, line: string, opcode: string, fields: CCLineAsm[], weight: number, asm: number) {
        this.type = type;
        this.line = line;
        this.opcode = opcode;
        this.fields = fields;
        this.weight = weight;
        this.asm = asm;
    }
}

export const instructionInfo = [
    {id: TreeType.Assignation, info: "Assigning a value to a register."},
    {id: TreeType.While, info: "The while loop works with 2 instructions: If the condition is met, jump forward; otherwise, jump backward."},
    {id: TreeType.If, info: "The if statement works with 2 instructions: If the condition is met, jump to a specific location; otherwise, jump to another location."},
    {id: TreeType.Add, info: "ALU Operation. Addition of Rs0 and Rs1 to Rd."},
    {id: TreeType.Sub, info: "ALU Operation. Subtraction of Rs0 and Rs1 to Rd."},
    {id: TreeType.DecG, info: "ALU Operation. Left Shift of Rs0 and Rs1 to Rd."},
    {id: TreeType.DecD, info: "ALU Operation. Right Shift of Rs0 and Rs1 to Rd."},
    {id: TreeType.DecA, info: "ALU Operation. Arithmetic Shift of Rs0 and Rs1 to Rd."},
    {id: TreeType.AND, info: "ALU Operation. And bit by bit of Rs0 and Rs1 to Rd."},
    {id: TreeType.OR, info: "ALU Operation. Or bit by bit of Rs0 and Rs1 to Rd."},
    {id: TreeType.NOT, info: "ALU Operation. Not bit by bit of Rs0 to Rd."},
];

export function getInstructionInfo(type: TreeType) {
    return instructionInfo.find((el)=>el.id == type);
}
