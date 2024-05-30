# CC Processor Compiler

![Docker Pulls](https://img.shields.io/docker/pulls/canardconfit/cc-compiler)
![GitHub Release](https://img.shields.io/github/v/release/CanardConfit/cc-compiler)
![GitHub Repo stars](https://img.shields.io/github/stars/CanardConfit/cc-compiler)

## Description

The cc-compiler project is developed as part of an exercise at [HEPIA in Geneva](https://www.hesge.ch/hepia/), where students are tasked with creating their own processor using [Logisim](https://github.com/logisim-evolution/logisim-evolution). This project aims to provide a Node.js-based compiler that can translate high-level language instructions into machine code compatible with the custom processor designed in Logisim.

## C-Like Syntax

| Syntax                       | Arguments                              | Example          | Description                                                                       |
|------------------------------|----------------------------------------|------------------|-----------------------------------------------------------------------------------|
| `R[0-7] = x`                 | x = Any int number (8 bits)            | `R0 = 0`         | Assignation                                                                       |
| `R[0-7] = R[0-7] + R[0-7]`   |                                        | `R0 = R1 + R2`   | Addition                                                                          |
| `R[0-7] = R[0-7] - R[0-7]`   |                                        | `R0 = R1 - R2`   | Substraction                                                                      |
| `R[0-7] = R[0-7] >> R[0-7]`  |                                        | `R0 = R1 >> R2`  | Shift right                                                                       |
| `R[0-7] = R[0-7] << R[0-7]`  |                                        | `R0 = R1 << R2`  | Shift left                                                                        |
| `R[0-7] = R[0-7] ASR R[0-7]` |                                        | `R0 = R1 ASR R2` | ASR shift                                                                         |
| `R[0-7] = R[0-7] and R[0-7]` |                                        | `R0 = R1 and R2` | And operation                                                                     |
| `R[0-7] = R[0-7] or R[0-7]`  |                                        | `R0 = R1 or R2`  | Or operation                                                                      |
| `R[0-7] = not R[0-7]`        |                                        | `R0 = not R1`    | Not operation                                                                     |
| `while x y`                  | x = (`not`)<br/> y = `N,Z,C,V`, `True` | `while True`     | While                                                                             |
| `if R[0-7] x R[0-7]`         | x = `==, !=, <=, >=, <, >`             | `if R0 == R1`    | If                                                                                |
| `{`                          |                                        | `                | Brace to start if or while block                                                  |
| `}`                          |                                        | `                | Brace to end if or while block                                                    |
| `STORE R[0-7] R[0-7] x`      | x = offset int                         | `STORE R0 R1 0`  | Store from value into R[0-7] to RAM or peripheral (R[0-7] value pointer + offset) |
| `LOAD R[0-7] R[0-7] x`       | x = offset int                         | `LOAD R1 R2 0`   | Store from RAM or peripheral (R[0-7] value pointer + offset) to R[0-7] variable   |


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

### Peripheral access table (TODO)

| Description       | Pointer value | Access | Pointer | offset |
| ----------------- | ------------- | ------ | ------- | ------ |
| **Leds**          | 128           | R / W  | 128     | 0      |
| Bit 0 - LED0      |               |        |         |        |
| Bit 1 - LED1      |               |        |         |        |
| Bit 2 - LED2      |               |        |         |        |
| Bit 3 - LED3      |               |        |         |        |
| Bit 4 - LED4      |               |        |         |        |
| Bit 5 - LED5      |               |        |         |        |
| Bit 6 - LED6      |               |        |         |        |
| Bit 7 - LED7      |               |        |         |        |
| **Buttons**       | 129           | R      | 129     | 0      |
| Bit 0 - BTN0      |               |        |         |        |
| Bit 1 - BTN1      |               |        |         |        |
| Bit 2 - BTN2      |               |        |         |        |
| Bit 3 - BTN3      |               |        |         |        |
| Bit 4 - BTN4      |               |        |         |        |
| Bit 5 - BTN5      |               |        |         |        |
| Bit 6 - BTN6      |               |        |         |        |
| Bit 7 - BTN7      |               |        |         |        |
| **UART**          |               |        |         |        |
| Address           | 130           | R      | 130     | 0      |
| DataH             | 131           | R      | 130     | 1      |
| DataL             | 132           | R      | 130     | 2      |
| **PWM**           |               |        |         |        |
| V1                | 133           | W      | 133     | 0      |
| V2                | 134           | W      | 133     | 1      |
| **Front Sensor**  |               |        |         |        |
| Left              | 135           | R      | 135     | 0      |
| Middle            | 136           | R      | 135     | 1      |
| Right             | 137           | R      | 135     | 2      |
| **Ground Sensor** |               |        |         |        |
| Left              | 138           | R      | 138     | 0      |
| Right             | 139           | R      | 138     | 1      |
| **Other**         |               |        |         |        |
| Valve             | 140           | W      | 140     | 0      |


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

```

Compiled to:

```bash
0x827F
0xC445
0x861E
0x2D0
0xA802
0xB002
0x8801
0x2D0
0xA803
0xB001
0x8800
0x8200
0xD840
```
