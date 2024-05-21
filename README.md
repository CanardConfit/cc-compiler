# CC Processor Compiler

![Docker Pulls](https://img.shields.io/docker/pulls/canardconfit/cc-compiler)
![GitHub Release](https://img.shields.io/github/v/release/CanardConfit/cc-compiler)
![GitHub Repo stars](https://img.shields.io/github/stars/CanardConfit/cc-compiler)

## Description

The cc-compiler project is developed as part of an exercise at [HEPIA in Geneva](https://www.hesge.ch/hepia/), where students are tasked with creating their own processor using [Logisim](https://github.com/logisim-evolution/logisim-evolution). This project aims to provide a Node.js-based compiler that can translate high-level language instructions into machine code compatible with the custom processor designed in Logisim.

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
| **Leds**          |               |        |         |        |
| LED0              | 128           | R / W  | 128     | 0      |
| LED1              | 129           | R / W  | 128     | 1      |
| LED2              | 130           | R / W  | 128     | 2      |
| LED3              | 131           | R / W  | 128     | 3      |
| LED4              | 132           | R / W  | 128     | 4      |
| LED5              | 133           | R / W  | 128     | 5      |
| LED6              | 134           | R / W  | 128     | 6      |
| LED7              | 135           | R / W  | 128     | 7      |
| **Buttons**       |               |        |         |        |
| BTN0              | 136           | R      | 136     | 0      |
| BTN1              | 137           | R      | 136     | 1      |
| BTN2              | 138           | R      | 136     | 2      |
| BTN3              | 139           | R      | 136     | 3      |
| BTN4              | 140           | R      | 136     | 4      |
| BTN5              | 141           | R      | 136     | 5      |
| BTN6              | 142           | R      | 136     | 6      |
| BTN7              | 143           | R      | 136     | 7      |
| **UART**          |               |        |         |        |
|                   |               |        |         |        |
| **PWM**           |               |        |         |        |
| PWM1              |               |        |         |        |
| DIR1              |               |        |         |        |
| PWM2              |               |        |         |        |
| DIR2              |               |        |         |        |
| **Front Sensor**  |               |        |         |        |
| Left              |               |        |         |        |
| Middle            |               |        |         |        |
| Right             |               |        |         |        |
| **Ground Sensor** |               |        |         |        |
| Left              |               |        |         |        |
| Right             |               |        |         |        |
| **Other**         |               |        |         |        |
|                   |               |        |         |        |


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
