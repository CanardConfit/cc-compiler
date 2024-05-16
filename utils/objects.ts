export enum CompilerVersion {
    V05 = "Version 0.5",
    V1 = "Version 1.0",
}

export interface CCOptions {
    compilerVersion: CompilerVersion;
    interruptEnable: boolean;
    interruptPadding: number;
    loadProgram: string;
}

export const programs = [
        {id: 0, name: "Fibonacci Simple V0.5", program: `
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
        {id: 1, name: "If test Simple V0.5", program: `
R0 = 127
R1 = 127
R2 = R1 + R0

if not Z
{
    R3 = 1
}
R1 = 2
`}];
