export enum CompilerVersion {
    V1 = "Version 1",
    V2 = "Version 2",
}

export interface CCOptions {
    compilerVersion: CompilerVersion;
    interruptEnable: boolean;
    interruptPadding: number;
    loadProgram: string;
    only8variables: boolean;
}
