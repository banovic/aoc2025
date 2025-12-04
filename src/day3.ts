import * as fs from 'fs';

function largestJoltage(bs: number[]): number {
    let maxJoltage = 0;
    for (let i = 0; i < bs.length - 1; i++) {
        for (let j = i + 1; j < bs.length; j++) {
            const joltage = bs[i]! * 10 + bs[j]!;
            if (joltage >= maxJoltage) {
                maxJoltage = joltage;
            }
        }
    }
    return maxJoltage;
}

function largestDigitInRange(bs: number[], start: number, end: number): [number, number] {
    let maxDigit = 0;
    let maxI = start;
    let i = start;
    for (; i <= end; i++) {
        if (bs[i]! > maxDigit) {
            maxDigit = bs[i]!;
            maxI = i + 1;
        }
    }
    return [maxDigit, maxI];
}

function largestJoltageV2(bs: number[]): number {
    let digits = [];
    let pos = 0;
    while (digits.length < 12) {
        const end = bs.length - (12 - digits.length);
        const [d, nextPos] = largestDigitInRange(bs, pos, end);
        digits.push(d);
        pos = nextPos;
    }
    return parseInt(digits.map(d => String(d)).join(''), 10);
}

function solution1(filename: string): void {
    const input = fs.readFileSync(filename, 'utf8');

    const banks = input.trim().split('\n').map(line => line.trim().split('').map(numStr => parseInt(numStr, 10)));

    const joltages = banks.map(largestJoltage)


    const sum = joltages.reduce((acc, joltage) => acc + joltage, 0);

    console.log('[1] Sum of joltages:', sum);
}

function solution2(filename: string): void {
    const input = fs.readFileSync(filename, 'utf8');

    const banks = input.trim().split('\n').map(line => line.trim().split('').map(numStr => parseInt(numStr, 10)));

    const joltages = banks.map(largestJoltageV2);

    const sum = joltages.reduce((acc, joltage) => acc + joltage, 0);

    console.log('[2] Sum of joltages:', sum);
}

solution1('input/day3-1.txt');
solution1('input/day3-2.txt');
solution2('input/day3-1.txt');
solution2('input/day3-2.txt');