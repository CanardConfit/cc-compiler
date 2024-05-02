# CC Processor Compiler

## Description

TODO

## Installation

TODO

## Usages

TODO

## Assembler instructions

### ALU instructions

| Operation        | Opcode        | Result     | Source 0   | Source 1   | Reserved   |
|------------------|---------------|------------|------------|------------|------------|
| *Bits*           | *15 14 13 12* | *11 10 09* | *08 07 06* | *05 04 03* | *02 01 00* |
| RD = RS0 + RS1   | 0000          | RD         | RS0        | RS1        | —          |
| RD = RS0 - RS1   | 0001          | RD         | RS0        | RS1        | —          |
| RD = RS0 << 1    | 0010          | RD         | RS0        | —          | —          |
| RD = RS0 >> 1    | 0011          | RD         | RS0        | —          | —          |
| RD = ASR(RS0)    | 0100          | RD         | RS0        | —          | —          |
| RD = RS0 AND RS1 | 0101          | RD         | RS0        | RS1        | —          |
| RD = RS0 OR RS1  | 0110          | RD         | RS0        | RS1        | —          |
| RD = NOT (RS0)   | 0111          | RD         | RS0        | —          | —          |

### Initialization with constant instructions

| Operation | Opcode        | Result     | Reserved | Constant                  |
|-----------|---------------|------------|----------|---------------------------|
| *Bits*    | *15 14 13 12* | *11 10 09* | *08*     | *07 06 05 04 03 02 01 00* |
| RD = val  | 1000          | RD         | -        | val                       |

### Unconditional jump instructions

| Operation             | Opcode        | Reserved      | Number of jump (signed)   |
|-----------------------|---------------|---------------|---------------------------|
| *Bits*                | *15 14 13 12* | *11 10 09 08* | *07 06 05 04 03 02 01 00* |
| **B** : PC = PC + val | 1011          | -             | val                       |

### Conditional jump instructions

| Operation                       | Opcode        | Condition     | Number of jump (signed)   |
|---------------------------------|---------------|---------------|---------------------------|
| *Bits*                          | *15 14 13 12* | *11 10 09 08* | *07 06 05 04 03 02 01 00* |
| **BC**: If(cond), PC = PC + val | 1010          | COND          | val                       |

### Branch instructions (TODO)

| Operation                       | Opcode        | Reg Link      | Reserved | Address to the function   |
|---------------------------------|---------------|---------------|----------|---------------------------|
| *Bits*                          | *15 14 13 12* | *11 10 09 08* | *08*     | *07 06 05 04 03 02 01 00* |
| **BL** : PC = val ; RL = PC + 1 | 1110          | RL            | -        | val                       |
| **BR** : PC = [RL]              | 1111          | RL            | -        | -                         |

### Memory access instructions (TODO)

| Instruction       | Opcode        | Result     | Pointer    | offset              |
|-------------------|---------------|------------|------------|---------------------|
| *Bits*            | *15 14 13 12* | *11 10 09* | *08 07 06* | *05 04 03 02 01 00* |
| LD RD, offset[RP] | 1100          | RD         | RP         | offset              |
| ST RS, offset[RP] | 1101          | RS         | RP         | offset              |

## Examples

```c
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
```

Compiled to:

```bash
0 0x8000
1 0x8200
2 0x8401
3 0x0640
4 0x0280
5 0x0498
6 0xA402
7 0xB0FC
8 0xB0F9
```

Another example:

```c
R0 = 127
R1 = 127
R2 = R1 + R0

if not Z
{
    R3 = 1
}
R1 = 2
```

Compiled to:

```bash
0 0x807F
1 0x827F
2 0x0440
3 0xA803
4 0xB001
5 0x8601
6 0x8202
```
