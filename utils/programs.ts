export default {
    programs:
[`
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
`,
`
R0 = 127
R1 = 127
R2 = R1 + R0

if not Z
{
    R3 = 1
}
R1 = 2
`]
};
