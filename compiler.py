import argparse
import array
import enum
import re
from os import path


def check_argument_consistency(args) -> bool:
    if not args.file and not args.text:
        print("You must enter an existing file to compile.")
        return False
    if args.file and not path.exists(args.file) and not args.text:
        print(f"Invalid file. File '{args.file}' must exist.")
        return False

    return True


def print_tree(node, depth=0):
    if not node:
        return
    indent = " " * (depth * 4)

    print(f"{indent}Tree(type={node.type.name}, weight={node.weight}, fields={node.fields})")

    if node.sub:
        print_tree(node.sub, depth + 1)

    if node.next:
        print_tree(node.next, depth)


class TreeType(enum.Enum):
    Entry, Assignation, While, If, Add, Sub, DecG, DecD, DecA, AND, OR, NOT, Start_While, End_While, More = range(15)


class Tree:
    def __init__(self, tree_type, fields=None, weight=1):
        self.type: TreeType = tree_type
        self.next: Tree | None = None
        self.sub: Tree | None = None
        self.weight = weight
        self.fields = fields if fields else []


PATTERNS = {
    re.compile(r"R([0-7])\s=\s*(\d+)"): TreeType.Assignation,
    re.compile(r"while\s+(not)?\s*([NZCV]|true)"): TreeType.While,
    re.compile(r"if\s+(not)?\s*([NZCV])"): TreeType.If,
    re.compile(r"R([0-7])\s*=\s*R([0-7])\s*\+\s*R([0-7])"): TreeType.Add,
    re.compile(r"R([0-7])\s*=\s*R([0-7])\s*-\s*R([0-7])"): TreeType.Sub,
    re.compile(r"R([0-7])\s*=\s*R([0-7])\s*<<\s*(\d+)"): TreeType.DecG,
    re.compile(r"R([0-7])\s*=\s*R([0-7])\s*>>\s*(\d+)"): TreeType.DecD,
    re.compile(r"R([0-7])\s*=\s*ASR\s*R([0-7])"): TreeType.DecA,
    re.compile(r"R([0-7])\s*=\s*R([0-7])\s*and\s*R([0-7])"): TreeType.AND,
    re.compile(r"R([0-7])\s*=\s*R([0-7])\s*or\s*R([0-7])"): TreeType.OR,
    re.compile(r"R([0-7])\s*=\s*not\s*R([0-7])"): TreeType.NOT,
    re.compile(r"{"): TreeType.Start_While,
    re.compile(r"}"): TreeType.End_While
}


def get_tree_of_line(line: str):
    for pattern, type_ in PATTERNS.items():
        match = pattern.search(line)
        if match:
            fields = [match.group(i) for i in range(1, pattern.groups + 1)]
            if type_ == TreeType.While and fields[0] == "not":
                return Tree(type_, fields, weight=2)
            elif type_ == TreeType.If:
                return Tree(type_, fields, weight=2)
            else:
                return Tree(type_, fields)
    return None


def clean_tree(tree: Tree):
    if tree.sub and tree.sub.type == TreeType.Start_While:
        tree.sub = tree.sub.next

    if tree.next and tree.next.type == TreeType.End_While:
        tree.next = tree.next.next

    if tree.next:
        clean_tree(tree.next)
    if tree.sub:
        clean_tree(tree.sub)


def string_to_binary(input_string, length=3):
    try:
        number = int(input_string)
        if number < 0:
            binary_representation = bin((1 << length) + number)[2:]
        else:
            binary_representation = bin(number)[2:]
        return binary_representation.zfill(length)
    except ValueError:
        raise ValueError("Error")


def binary_to_hexadecimal(binary_string):
    try:
        number = int(binary_string, 2)
        hexadecimal_representation = hex(number)[2:]
        return hexadecimal_representation.upper()
    except ValueError:
        raise ValueError("Error")


def asm_2fields(code: str, tree: Tree):
    return f"{code}{string_to_binary(tree.fields[0])}{string_to_binary(tree.fields[1])}00000"


def asm_3fields(code: str, tree: Tree):
    return f"{code}{string_to_binary(tree.fields[0])}{string_to_binary(tree.fields[1])}{string_to_binary(tree.fields[2])}000"


def compute_asm(tree: Tree) -> array:
    if tree.type == TreeType.Assignation:
        return [f"1000{string_to_binary(tree.fields[0])}0{string_to_binary(tree.fields[1], 8)}"]
    if tree.type == TreeType.While:
        jump = str(-tree.fields[2])
        if tree.fields[0] is None:
            match tree.fields[1]:
                case 'true':
                    return [f"10110000{string_to_binary(jump, 8)}"]
                case 'Z':
                    return [f"10101000{string_to_binary(jump, 8)}"]
                case 'N':
                    return [f"10100100{string_to_binary(jump, 8)}"]
                case 'C':
                    return [f"10100010{string_to_binary(jump, 8)}"]
                case 'V':
                    return [f"10100001{string_to_binary(jump, 8)}"]
        else:
            match tree.fields[1]:
                case 'true':
                    raise SyntaxError("A while with condition 'true' with a 'not' behind is not possible", tree)
                case 'Z':
                    return [
                        f"1010100000000010",
                        f"10110000{string_to_binary(jump, 8)}"
                    ]
                case 'N':
                    return [
                        f"1010010000000010",
                        f"10110000{string_to_binary(jump, 8)}"
                    ]
                case 'C':
                    return [
                        f"1010001000000010",
                        f"10110000{string_to_binary(jump, 8)}"
                    ]
                case 'V':
                    return [
                        f"1010000100000010",
                        f"10110000{string_to_binary(jump, 8)}"
                    ]
    if tree.type == TreeType.If:
        jump = str(tree.fields[2])
        jump1 = 2
        if tree.fields[0] == "not":
            jump1 = str(int(jump) + 1)
            jump = 1
        match tree.fields[1]:
            case 'Z':
                return [
                    f"10101000{string_to_binary(jump1, 8)}",
                    f"10110000{string_to_binary(jump, 8)}"
                ]
            case 'N':
                return [
                    f"10100100{string_to_binary(jump1, 8)}",
                    f"10110000{string_to_binary(jump, 8)}"
                ]
            case 'C':
                return [
                    f"10100010{string_to_binary(jump1, 8)}",
                    f"10110000{string_to_binary(jump, 8)}"
                ]
            case 'V':
                return [
                    f"10100001{string_to_binary(jump1, 8)}",
                    f"10110000{string_to_binary(jump, 8)}"
                ]
    if tree.type == TreeType.Add:
        return [asm_3fields("0000", tree)]
    if tree.type == TreeType.Sub:
        return [asm_3fields("0001", tree)]
    if tree.type == TreeType.DecG:
        return [asm_2fields("0010", tree)]
    if tree.type == TreeType.DecD:
        return [asm_2fields("0011", tree)]
    if tree.type == TreeType.DecA:
        return [asm_2fields("0100", tree)]
    if tree.type == TreeType.AND:
        return [asm_3fields("0101", tree)]
    if tree.type == TreeType.OR:
        return [asm_3fields("0110", tree)]
    if tree.type == TreeType.NOT:
        return [asm_2fields("0111", tree)]

    return []


def tree_to_asm(lst: array, tree: Tree, debug: bool = False):
    current = tree
    while current is not None:
        asm = compute_asm(current)
        lst += asm
        if debug:
            print(
                f"Tree(type={current.type.name}, weight={current.weight} fields={current.fields}) | {asm} | {[f"0x{binary_to_hexadecimal(a).zfill(4)}" for a in asm]}")

        if current.sub:
            tree_to_asm(lst, current.sub)

        current = current.next


def get_num_nodes(tree: Tree | None):
    if tree is None:
        return 0

    return tree.weight + get_num_nodes(tree.next) + get_num_nodes(tree.sub)


def revert_conditions(tree: Tree):
    current = tree

    while current.next:
        c = current.next
        if c.type == TreeType.While:
            current.sub = c.sub
            c.sub = None
            c.fields.append(get_num_nodes(current.sub) + c.weight - 1)
        elif c.type == TreeType.If:
            c.fields.append(get_num_nodes(c.sub) + c.weight - 1)

        if current.sub:
            revert_conditions(current.sub)

        current = current.next


def compile_cc(lines: [], bn: bool = False, debug: bool = False):
    tree = Tree(TreeType.Entry)
    current = tree

    sub_list = []

    for line in lines:
        if line[len(line) - 1] == '\n':
            line = line.removesuffix('\n')

        tmp = get_tree_of_line(line.strip())

        if tmp is None:
            continue

        if line.strip() == "{":
            current.sub = tmp
            sub_list.append(current)
        else:
            current.next = tmp

        if line.strip() == "}":
            current = sub_list.pop()
        else:
            current = tmp

    clean_tree(tree)

    if debug:
        print_tree(tree)

    revert_conditions(tree)

    if debug:
        print("-----Revert")
        print_tree(tree)
        print("-----")
    tree = tree.next

    asm = []

    tree_to_asm(asm, tree, debug)

    for i, e in enumerate(asm):
        if bn:
            print(f"{i} {e}")
        else:
            print(f"{i} 0x{binary_to_hexadecimal(e).zfill(4)}")


def main():
    arg_parser = argparse.ArgumentParser(prog="CanardConfit (cc) Compiler", description="")
    arg_parser.add_argument("-f", "--file", help="The file to compile.")
    arg_parser.add_argument("-t", "--text", help="The text to compile.")
    arg_parser.add_argument("--bin", help="Choose binary instead of hexadecimal print", default=False,
                            choices=["True", "False"])
    arg_parser.add_argument("--debug", help="Debug compilation.", default=False, choices=["True", "False"])
    args = arg_parser.parse_args()
    if not check_argument_consistency(args):
        exit(1)

    file = args.file
    debug = args.debug
    bn = args.bin

    if file:
        with open(file, 'r') as fileStream:
            lines = fileStream.readlines()
    else:
        lines = args.text.split("\n")
        if len(lines) == 1 and "\\n" in args.text:
            lines = args.text.split("\\n")
    compile_cc(lines, bn, debug)


if __name__ == "__main__":
    main()
