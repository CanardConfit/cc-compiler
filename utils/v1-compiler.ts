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
    {regex: /R([0-7])\s=\s*(-?\d+)/, type: TreeType.Assignation},
    {regex: /while\s+(not)?\s*([NZCV]|true)/, type: TreeType.While},
    {regex: /if\s*R([0-7])\s*([!=><]=?)\s+R([0-7])/, type: TreeType.IF},
    {regex: /R([0-7])\s*=\s*R([0-7])\s*\+\s*R([0-7])/, type: TreeType.ADD},
    {regex: /R([0-7])\s*=\s*R([0-7])\s*-\s*R([0-7])/, type: TreeType.SUB},
    {regex: /R([0-7])\s*=\s*R([0-7])\s*<<\s*1/, type: TreeType.DecG},
    {regex: /R([0-7])\s*=\s*R([0-7])\s*>>\s*1/, type: TreeType.DecD},
    {regex: /R([0-7])\s*=\s*ASR\s*R([0-7])/, type: TreeType.DecA},
    {regex: /R([0-7])\s*=\s*R([0-7])\s*and\s*R([0-7])/, type: TreeType.AND},
    {regex: /R([0-7])\s*=\s*R([0-7])\s*or\s*R([0-7])/, type: TreeType.OR},
    {regex: /R([0-7])\s*=\s*not\s*R([0-7])/, type: TreeType.NOT},
    {regex: /STORE\s*R([0-7])\s*R([0-7])\s*(-?\d*)/, type: TreeType.STORE},
    {regex: /LOAD\s*R([0-7])\s*R([0-7])\s*(-?\d*)/, type: TreeType.LOAD},
    {regex: /^{/, type: TreeType.START_BRACE},
    {regex: /^}/, type: TreeType.END_BRACE},
];

function get_tree_of_line(line: string) {
    for (const pattern of PATTERNS) {
        const type_ = pattern.type;
        let match: string[]|undefined = pattern.regex.exec(line)?.map((el) => el);
        if (match) {
            match = match.slice(1, match.length);
            if (type_ == TreeType.While && match[0] == "not") {
                return new Tree(line, type_, match, 2);
            } else if (type_ == TreeType.IF) {
                return new Tree(line, type_, match, 2);
            } else {
                return new Tree(line, type_, match);
            }
        }
    }
    return null;
}

function clean_tree(tree: Tree) {
    if (tree.sub && tree.sub.type == TreeType.START_BRACE) {
        tree.sub = tree.sub.next;
    }
    if (tree.next && tree.next.type == TreeType.END_BRACE) {
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
    const number = Number(input_string);
    let binary_representation;
    if (number < 0) {
        binary_representation = ((1 << length) + number).toString(2);
    } else {
        binary_representation = number.toString(2);
    }
    if (binary_representation.length > length) {
        throw Error(`This number, '${number}', cannot be upper than ${Math.pow(2, length) - 1}.`);
    }
    return binary_representation.padStart(length, '0');
}

function asm_2fields(code: string, tree: Tree): CCLine {
    return l(tree, [cc("opcode", `${code}`), cc("result", `${string_to_binary(tree.fields[0] as string)}`), cc("source 0", `${string_to_binary(tree.fields[1] as string)}`), cc("x", `00000`)]);
}

function asm_3fields(code: string, tree: Tree): CCLine {
    return l(tree, [cc("opcode", `${code}`), cc("result", `${string_to_binary(tree.fields[0] as string)}`), cc("source 0", `${string_to_binary(tree.fields[1] as string)}`), cc("source 1", `${string_to_binary(tree.fields[2] as string)}`), cc("x", `000`)]);
}

function cc(key: string, field: string) {
    return new CCLineAsm(key, field);
}

function l(tree: Tree, asm: CCLineAsm[], type: TreeType = tree.type): CCLine {
    return new CCLine(type, tree.line, tree.line.substring(0, 5), asm, 1, parseInt(asm.map((el) => el.value).join(""), 2));
}

function compute_asm(tree: Tree): CCLine[] {
    if (tree.type == TreeType.Assignation) {
        return [l(tree, [cc("opcode", `1000`), cc("result", `${string_to_binary(tree.fields[0] as string)}`), cc("x", `0`), cc("constant", `${string_to_binary(tree.fields[1] as string, 8)}`)])];
    } else if (tree.type == TreeType.While) {
        let jump = (-(tree.fields[2] as number)).toString();
        if (tree.fields[0] == null) {
            switch (tree.fields[1]) {
                case 'true':
                    return [l(tree, [cc("opcode", `1011`), cc("x", `0000`), cc("jumps", `${string_to_binary(jump, 8)}`)])];
                case 'Z':
                    return [l(tree, [cc("opcode", `1010`), cc("condition", `1000`), cc("jumps", `${string_to_binary(jump, 8)}`)])];
                case 'N':
                    return [l(tree, [cc("opcode", `1010`), cc("condition", `0100`), cc("jumps", `${string_to_binary(jump, 8)}`)])];
                case 'C':
                    return [l(tree, [cc("opcode", `1010`), cc("condition", `0010`), cc("jumps", `${string_to_binary(jump, 8)}`)])];
                case 'V':
                    return [l(tree, [cc("opcode", `1010`), cc("condition", `0001`), cc("jumps", `${string_to_binary(jump, 8)}`)])];
            }
        } else {
            switch (tree.fields[1]) {
                case 'true':
                    throw SyntaxError("A while with condition 'true' with a 'not' behind is not possible");
                case 'Z':
                    return [
                        l(tree, [cc("opcode", `1010`), cc("condition", `1000`), cc("jumps", `00000010`)]),
                        l(tree, [cc("opcode", `1011`), cc("x", `0000`), cc("jumps", `${string_to_binary(jump, 8)}`)])
                    ];
                case 'N':
                    return [
                        l(tree, [cc("opcode", `1010`), cc("condition", `0100`), cc("jumps", `00000010`)]),
                        l(tree, [cc("opcode", `1011`), cc("x", `0000`), cc("jumps", `${string_to_binary(jump, 8)}`)])
                    ];
                case 'C':
                    return [
                        l(tree, [cc("opcode", `1010`), cc("condition", `0010`), cc("jumps", `00000010`)]),
                        l(tree, [cc("opcode", `1011`), cc("x", `0000`), cc("jumps", `${string_to_binary(jump, 8)}`)])
                    ];
                case 'V':
                    return [
                        l(tree, [cc("opcode", `1010`), cc("condition", `0001`), cc("jumps", `00000010`)]),
                        l(tree, [cc("opcode", `1011`), cc("x", `0000`), cc("jumps", `${string_to_binary(jump, 8)}`)])
                    ];
            }
        }
    } else if (tree.type == TreeType.IF) {
        let ret: CCLine[] = [];
        let jump = parseInt(tree.fields[3] as string);
        let jump1 = 2;
        let sign = tree.fields[1] as string;

        if (sign.startsWith("!")) {
            jump1 = jump;
            jump = 1;
        }

        let Rs1 = string_to_binary(tree.fields[0] as string, 3);
        let Rs2 = string_to_binary(tree.fields[2] as string, 3);

        ret.push(l(tree, [cc("opcode", "0001"), cc("result", "000"), cc("source1", Rs2), cc("source 2", Rs1), cc("x", "000")], TreeType.IF_SUB));

        switch (sign) {
            case '>':
                ret.push(l(tree, [cc("opcode", `1010`), cc("condition", `0100`), cc("jumps", `${string_to_binary(jump1.toString(), 8)}`)], TreeType.IF_COND));
                break;
            case '<':
                ret.push(l(tree, [cc("opcode", `1010`), cc("condition", `0100`), cc("jumps", `${string_to_binary((jump + 3).toString(), 8)}`)], TreeType.IF_COND));
                jump = 1;
                break;
            case '=':
                throw Error("Cannot have = without other = after.");
            case '!':
                throw Error("Cannot have ! without = after.");
            case '==':
                ret.push(l(tree, [cc("opcode", `1010`), cc("condition", `1000`), cc("jumps", `${string_to_binary(jump1.toString(), 8)}`)], TreeType.IF_COND));
                break;
            case '!=':
                ret.push(l(tree, [cc("opcode", `1010`), cc("condition", `1000`), cc("jumps", `${string_to_binary((jump + 2).toString(), 8)}`)], TreeType.IF_COND));
                break;
            case '>=':
                ret.push(l(tree, [cc("opcode", `1010`), cc("condition", `0100`), cc("jumps", `${string_to_binary("3", 8)}`)], TreeType.IF_COND));
                ret.push(l(tree, [cc("opcode", `1010`), cc("condition", `1000`), cc("jumps", `${string_to_binary(jump1.toString(), 8)}`)], TreeType.IF_COND));
                break;
            case '<=':
                ret.push(l(tree, [cc("opcode", `1010`), cc("condition", `0100`), cc("jumps", `${string_to_binary((jump + 3).toString(), 8)}`)], TreeType.IF_COND));
                ret.push(l(tree, [cc("opcode", `1010`), cc("condition", `1000`), cc("jumps", `${string_to_binary(jump1.toString(), 8)}`)], TreeType.IF_COND));
                jump = jump1
                break;
        }

        ret.push(l(tree, [cc("opcode", `1011`), cc("x", `0000`), cc("jumps", `${string_to_binary(jump.toString(), 8)}`)], TreeType.IF_ELSE));

        return ret;
    } else if (tree.type == TreeType.STORE) {
        return [l(tree, [cc("opcode", `1101`), cc("Rs", `${string_to_binary(tree.fields[0] as string)}`), cc("Rp", `${string_to_binary(tree.fields[1] as string)}`), cc("offset", `${string_to_binary(tree.fields[2] as string, 6)}`)])];
    } else if (tree.type == TreeType.LOAD) {
        return [l(tree, [cc("opcode", `1100`), cc("Rd", `${string_to_binary(tree.fields[0] as string)}`), cc("Rp", `${string_to_binary(tree.fields[1] as string)}`), cc("offset", `${string_to_binary(tree.fields[2] as string, 6)}`)])];
    } else if (tree.type == TreeType.ADD) {
        return [asm_3fields("0000", tree)];
    } else if (tree.type == TreeType.SUB) {
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
        let lines = compute_asm(current);

        lst.push(...lines);

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
    let current: Tree | null = tree;

    while (current != null) {
        if (current.next) {
            let c = current.next;
            if (c.type == TreeType.While) {
                current.sub = c.sub;
                c.sub = null;
                c.fields.push(get_num_nodes(current.sub) + c.weight - 1);
            }
        }
        if (current.type == TreeType.IF) {
            let val = get_num_nodes(current.sub) + current.weight - 1;
            current.fields.push(val);
        }

        if (current.sub) {
            revert_conditions(current.sub);
        }

        current = current.next;
    }
}

export function v1_compile_cc(lines: string[], debug: boolean = false): CCLine[] {
    let tree = new Tree("", TreeType.Entry);
    let current: Tree = tree;

    let sub_list: Tree[] = [];

    for (const [index, l] of lines.entries()) {
        try {
            let line = l.trim();
            if (line.endsWith('\n')) {
                line = line.slice(0, line.length - 2);
            }
            let tmp = get_tree_of_line(line.trim());

            if (tmp == null) {
                if (line != "" && line != " " && !line.startsWith("//")) {
                    throw new Error(`Unresolved line '${line}'.`);
                }
                continue;
            }

            if (line.includes("{") && tmp.type != TreeType.START_BRACE) {
                throw new Error(`Braces ('{' or '}') must be on their own line.`);
            }

            if (line == "{") {
                current.sub = tmp;
                sub_list.push(current);
            } else {
                current.next = tmp;
            }

            if (line == "}") {
                current = sub_list.pop()!;
            } else {
                current = tmp;
            }
        } catch (error: any) {
            throw new Error(error.message + ` At line ${index + 1}.`);
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
