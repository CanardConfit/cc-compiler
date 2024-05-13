export function formatHexByte(value: number): string {
    let text = value.toString(16);
    if (value < 16) {
        text = '0' + text;
    }
    return text.toUpperCase();
}

export function addToArray(array: number[], values: number[]): number[] {
    // On fait une copie du tableau
    const result = array.slice();
    // Pour chaque élément à ajouter au tableau...
    for (const v of values) {
        // Est-ce que l'élément est déjà dans le tableau ?
        if (-1 === result.indexOf(v)) {
            // Non, alors on l'ajoute
            result.push(v);
        }
    }
    // On retourne le tableau
    return result;
}

export function isSpace(c: number): boolean {
    return c === ' '.charCodeAt(0) || c === '\t'.charCodeAt(0) || c === '\n'.charCodeAt(0) || c === '\r'.charCodeAt(0);
}

export function isHexDigit(c: number): boolean {
    return (c >= '0'.charCodeAt(0) && c <= '9'.charCodeAt(0)) ||
        (c >= 'A'.charCodeAt(0) && c <= 'F'.charCodeAt(0)) ||
        (c >= 'a'.charCodeAt(0) && c <= 'f'.charCodeAt(0));
}

export function hexToNumber(c: number): number {
    if (c >= '0'.charCodeAt(0) && c <= '9'.charCodeAt(0)) { return c - '0'.charCodeAt(0); }
    if (c >= 'A'.charCodeAt(0) && c <= 'F'.charCodeAt(0)) { return 10 + c - 'A'.charCodeAt(0); }
    if (c >= 'a'.charCodeAt(0) && c <= 'f'.charCodeAt(0)) { return 10 + c - 'a'.charCodeAt(0); }
    return 0;
}
