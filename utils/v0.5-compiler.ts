import {Tree, CCLine, CCLineAsm, TreeType} from "~/utils/objects";

function print_tree(tree: Tree, depth=0) {
    if (!tree) {
        return;
    }
    const indent = " ".repeat(depth * 4);

    console.log(`${indent}Tree(type=${TreeType[tree.type]}, weight=${tree.weight}, fields=${tree.fields})`);

    if (tree.sub) {
        print_tree(tree.sub, depth + 1);
    }
    if (tree.next) {
        print_tree(tree.next, depth);
    }
}

const PATTERNS: {regex: RegExp, type: TreeType}[] = [
    {regex: /R([0-7])\s=\s*(\d+)/, type: TreeType.Assignation},
    {regex: /while\s+(not)?\s*([NZCV]|true)/, type: TreeType.While},
    {regex: /if\s+(not)?\s*([NZCV])/, type: TreeType.If},
    {regex: /R([0-7])\s*=\s*R([0-7])\s*\+\s*R([0-7])/, type: TreeType.Add},
    {regex: /R([0-7])\s*=\s*R([0-7])\s*-\s*R([0-7])/, type: TreeType.Sub},
    {regex: /R([0-7])\s*=\s*R([0-7])\s*<<\s*(\d+)/, type: TreeType.DecG},
    {regex: /R([0-7])\s*=\s*R([0-7])\s*>>\s*(\d+)/, type: TreeType.DecD},
    {regex: /R([0-7])\s*=\s*ASR\s*R([0-7])/, type: TreeType.DecA},
    {regex: /R([0-7])\s*=\s*R([0-7])\s*and\s*R([0-7])/, type: TreeType.AND},
    {regex: /R([0-7])\s*=\s*R([0-7])\s*or\s*R([0-7])/, type: TreeType.OR},
    {regex: /R([0-7])\s*=\s*not\s*R([0-7])/, type: TreeType.NOT},
    {regex: /{/, type: TreeType.Start_While},
    {regex: /}/, type: TreeType.End_While},
];

function get_tree_of_line(line: string) {
    for (const pattern of PATTERNS) {
        const type_ = pattern.type;
        let match: string[]|undefined = pattern.regex.exec(line)?.map((el) => el);
        if (match) {
            match = match.slice(1, match.length);
            if (type_ == TreeType.While && match[0] == "not") {
                return new Tree(line, type_, match, 2);
            } else if (type_ == TreeType.If) {
                return new Tree(line, type_, match, 2);
            } else {
                return new Tree(line, type_, match);
            }
        }
    }
    return null;
}

function clean_tree(tree: Tree) {
    if (tree.sub && tree.sub.type == TreeType.Start_While) {
        tree.sub = tree.sub.next;
    }
    if (tree.next && tree.next.type == TreeType.End_While) {
        tree.next = tree.next.next;
    }
    if (tree.next) {
        clean_tree(tree.next);
    }
    if (tree.sub) {
        clean_tree(tree.sub);
    }
}

function string_to_binary(input_string: string, length=3) {
    try {
        const number = Number(input_string);
        let binary_representation;
        if (number < 0) {
            binary_representation = ((1 << length) + number).toString(2);
        } else {
            binary_representation = number.toString(2);
        }
        return binary_representation.padStart(length, '0');
    } catch (e: unknown) {
        throw Error("Error");
    }
}

function binary_to_hexadecimal(binary_string: string) {
    try {
        let number = parseInt(binary_string, 2);
        let hexadecimal_representation = number.toString(16);
        return hexadecimal_representation.toUpperCase();
    } catch (e: unknown) {
        throw Error("Error");
    }
}

function asm_2fields(code: string, tree: Tree): CCLineAsm[] {
    return [cc("opcode", `${code}`), cc("result", `${string_to_binary(tree.fields[0] as string)}`), cc("source 0", `${string_to_binary(tree.fields[1] as string)}`), cc("x", `00000`)];
}

function asm_3fields(code: string, tree: Tree): CCLineAsm[] {
    return [cc("opcode", `${code}`), cc("result", `${string_to_binary(tree.fields[0] as string)}`), cc("source 0", `${string_to_binary(tree.fields[1] as string)}`), cc("source 1", `${string_to_binary(tree.fields[2] as string)}`), cc("x", `000`)];
}

function cc(key: string, field: string) {
    return new CCLineAsm(key, field);
}

function compute_asm(tree: Tree): CCLineAsm[][] {
    if (tree.type == TreeType.Assignation) {
        return [[cc("opcode", `1000`), cc("result", `${string_to_binary(tree.fields[0] as string)}`), cc("x", `0`), cc("constant", `${string_to_binary(tree.fields[1] as string, 8)}`)]];
    } else if (tree.type == TreeType.While) {
        let jump = (-(tree.fields[2] as number)).toString();
        if (tree.fields[0] == null) {
            switch (tree.fields[1]) {
                case 'true':
                    return [[cc("opcode", `1011`), cc("x", `0000`), cc("", `${string_to_binary(jump, 8)}`)]];
                case 'Z':
                    return [[cc("opcode", `1010`), cc("condition", `1000`), cc("jumps", `${string_to_binary(jump, 8)}`)]];
                case 'N':
                    return [[cc("opcode", `1010`), cc("condition", `0100`), cc("jumps", `${string_to_binary(jump, 8)}`)]];
                case 'C':
                    return [[cc("opcode", `1010`), cc("condition", `0010`), cc("jumps", `${string_to_binary(jump, 8)}`)]];
                case 'V':
                    return [[cc("opcode", `1010`), cc("condition", `0001`), cc("jumps", `${string_to_binary(jump, 8)}`)]];
            }
        } else {
            switch (tree.fields[1]) {
                case 'true':
                    throw SyntaxError("A while with condition 'true' with a 'not' behind is not possible");
                case 'Z':
                    return [
                        [cc("opcode", `1010`), cc("condition", `1000`), cc("jumps", `00000010`)],
                        [cc("opcode", `1011`), cc("x", `0000`), cc("jumps", `${string_to_binary(jump, 8)}`)]
                    ];
                case 'N':
                    return [
                        [cc("opcode", `1010`), cc("condition", `0100`), cc("jumps", `00000010`)],
                        [cc("opcode", `1011`), cc("x", `0000`), cc("jumps", `${string_to_binary(jump, 8)}`)]
                    ];
                case 'C':
                    return [
                        [cc("opcode", `1010`), cc("condition", `0010`), cc("jumps", `00000010`)],
                        [cc("opcode", `1011`), cc("x", `0000`), cc("jumps", `${string_to_binary(jump, 8)}`)]
                    ];
                case 'V':
                    return [
                        [cc("opcode", `1010`), cc("condition", `0001`), cc("jumps", `00000010`)],
                        [cc("opcode", `1011`), cc("x", `0000`), cc("jumps", `${string_to_binary(jump, 8)}`)]
                    ];
            }
        }
    } else if (tree.type == TreeType.If) {
        let jump = String(tree.fields[2]);
        let jump1 = "2";
        if (tree.fields[0] == "not") {
            jump1 = (parseInt(jump) + 1).toString();
            jump = "1";
        }
        switch (tree.fields[1]) {
            case 'Z':
                return [
                    [cc("opcode", `1010`), cc("condition", `1000`), cc("jumps", `${string_to_binary(jump1, 8)}`)],
                    [cc("opcode", `1011`), cc("x", `0000`), cc("jumps", `${string_to_binary(jump, 8)}`)]
                ]
            case 'N':
                return [
                    [cc("opcode", `1010`), cc("condition", `0100`), cc("jumps", `${string_to_binary(jump1, 8)}`)],
                    [cc("opcode", `1011`), cc("x", `0000`), cc("jumps", `${string_to_binary(jump, 8)}`)]
                ]
            case 'C':
                return [
                    [cc("opcode", `1010`), cc("condition", `0010`), cc("jumps", `${string_to_binary(jump1, 8)}`)],
                    [cc("opcode", `1011`), cc("x", `0000`), cc("jumps", `${string_to_binary(jump, 8)}`)]
                ]
            case 'V':
                return [
                    [cc("opcode", `1010`), cc("condition", `0001`), cc("jumps", `${string_to_binary(jump1, 8)}`)],
                    [cc("opcode", `1011`), cc("x", `0000`), cc("jumps", `${string_to_binary(jump, 8)}`)]
                ]
        }
    } else if (tree.type == TreeType.Add) {
        return [asm_3fields("0000", tree)];
    } else if (tree.type == TreeType.Sub) {
        return [asm_3fields("0001", tree)];
    } else if (tree.type == TreeType.DecG) {
        return [asm_2fields("0010", tree)];
    } else if (tree.type == TreeType.DecD) {
        return [asm_2fields("0011", tree)];
    } else if (tree.type == TreeType.DecA) {
        return [asm_2fields("0100", tree)];
    } else if (tree.type == TreeType.AND) {
        return [asm_3fields("0101", tree)];
    } else if (tree.type == TreeType.OR) {
        return [asm_3fields("0110", tree)];
    } else if (tree.type == TreeType.NOT) {
        return [asm_2fields("0111", tree)];
    }

    return [];
}

function tree_to_asm(lst: CCLine[], tree: Tree, debug: boolean = false) {
    let current: Tree|null = tree;
    while (current != null) {
        let asm = compute_asm(current);

        for (let as of asm) {
            lst.push(new CCLine(current.type, current.line, current.line.substring(0, 5), as, current.weight, parseInt(as.map((el) => el.value).join(""), 2)));
        }

        if (current.sub) {
            tree_to_asm(lst, current.sub, debug);
        }
        current = current.next;
    }
}


function get_num_nodes(tree: Tree|null): number {
    if (tree == null) {
        return 0
    }

    return tree.weight + get_num_nodes(tree.next) + get_num_nodes(tree.sub);
}


function revert_conditions(tree: Tree) {
    let current = tree;

    while (current.next) {
        let c = current.next;
        if (c.type == TreeType.While) {
            current.sub = c.sub;
            c.sub = null;
            c.fields.push(get_num_nodes(current.sub) + c.weight - 1);
        } else if (c.type == TreeType.If) {
            c.fields.push(get_num_nodes(c.sub) + c.weight - 1);
        }

        if (current.sub) {
            revert_conditions(current.sub);
        }

        current = current.next;
    }
}

export function v05_compile_cc(lines: string[], debug: boolean = false): CCLine[] {
    let tree = new Tree("", TreeType.Entry);
    let current: Tree = tree;

    let sub_list: Tree[] = [];

    for (const l of lines) {
        let line = l;
        if (line.endsWith('\n')) {
            line = line.slice(0, line.length-2);
        }

        let tmp = get_tree_of_line(line.trim());

        if (tmp == null) {
            continue;
        }

        if (line.trim() == "{") {
            current.sub = tmp;
            sub_list.push(current);
        } else {
            current.next = tmp;
        }

        if (line.trim() == "}") {
            current = sub_list.pop()!;
        } else {
            current = tmp;
        }
    }
    clean_tree(tree);

    if (debug) {
        print_tree(tree);
    }

    revert_conditions(tree);

    if (debug) {
        console.log("-----Revert");
        print_tree(tree);
        console.log("-----");
    }
    tree = tree.next!;

    let ret: CCLine[] = [];

    tree_to_asm(ret, tree, debug);

    return ret;
}
