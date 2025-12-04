import * as fs from 'fs';

function isInvalidIdV2(id: string): boolean {
    for (let len = 1; len <= Math.floor(id.length / 2.0); len++) {
        if (id.length % len !== 0) {
            continue;
        }

        const n = id.length / len;

        let allMatch = true;
        for (let i = 1; i < n; i++) {
            if (id.substring(0, len) !== id.substring(i * len, Math.min((i + 1) * len, id.length))) {
                allMatch = false;
                break;
            }
        }
        if (allMatch) {
            return true;
        }
    }

    return false;
}

function isInvalidId(id: string): boolean {
    return id.length % 2 === 0 && id.substring(0, id.length / 2) === id.substring(id.length / 2);
}

function findInvalidIdsInRange(range: [string, string], p: (s: string) => boolean): string[] {
    const invalidIds: string[] = [];
    const [start, end] = range;
    const startNum = parseInt(start, 10);
    const endNum = parseInt(end, 10);
    let i = startNum;

    while (i <= endNum) {
        if (p(String(i))) {
            invalidIds.push(String(i));
        }
        i += 1;
    }

    return invalidIds;
}

function solution1(filename: string): void {
    const input = fs.readFileSync(filename, 'utf8');

    const parseRange: (range: string) => [string, string] = (range) => {
        const [start, end] = range.split('-', 2);
        return [start || '', end || ''];
    };

    const ranges = input.trim()
        .split(',')
        .map(parseRange);

    const invalidIds = ranges.flatMap(range => findInvalidIdsInRange(range, isInvalidId));
    const sum = invalidIds.reduce((acc, id) => acc + parseInt(id, 10), 0);

    console.log('[1] Sum of invalid IDs:', sum);
}

function solution2(filename: string): void {
    const input = fs.readFileSync(filename, 'utf8');

    const parseRange: (range: string) => [string, string] = (range) => {
        const [start, end] = range.split('-', 2);
        return [start || '', end || ''];
    };

    const ranges = input.trim()
        .split(',')
        .map(parseRange);

    const invalidIds = ranges.flatMap(range => findInvalidIdsInRange(range, isInvalidIdV2));
    const sum = invalidIds.reduce((acc, id) => acc + parseInt(id, 10), 0);

    console.log('[2] Sum of invalid IDs:', sum);
}

solution1('input/day2-1.txt');
solution1('input/day2-2.txt');
solution2('input/day2-1.txt');
solution2('input/day2-2.txt');