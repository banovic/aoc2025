import * as fs from 'fs';

function transpose(sheet: string[][]): string[][] {
    if (sheet.length === 0) {
        return [];
    }

    const transposed: string[][] = [];
    for (let c = 0; c < sheet[0]!.length; c++) {
        transposed.push([]);
        for (let r = 0; r < sheet.length; r++) {
            transposed[c]!.push(sheet[r]![c]!);
        }
    }
    return transposed;
}

// @ts-ignore
// @param sheet - transposed sheet
function prepareHomework(transposed: string[][]): [number[], string][] {
    return transposed.map(row => {
        const operands = row.slice(0, -1).map(Number);
        const operator = row[row.length - 1]!;
        return [operands, operator];
    });
}

// @ts-ignore
function problemRanges(sheet: string[][]): [number, number][] {
    const ranges: [number, number][] = [];
    let pi = 0;
    for (let i = 0; i < sheet[0]!.length; i++) {
        if (sheet.every(row => row[i] === ' ')) {
            ranges.push([pi, i]);
            pi = i + 1;
        }
        if (i === sheet[0]!.length - 1) {
            ranges.push([pi, i + 1]);
        }
    }
    return ranges;
}

function extractNumbers(operands: string[]): number[] {
    const maxDigit = operands[0]!.length;
    const ns: string[] = [];

    for (let d = 0; d < maxDigit; d++) {
        ns.push(operands.map(op => op[d] === ' ' ? '' : op[d]!).join(''));
    }
    return ns.map(n => Number(n.trim()));
}

// @ts-ignore
function splitAndPrepareProblems(sheet: string[][], ranges: [number, number][]): [number[], string][] {
    const problems = ranges.map(([start, end]) => sheet.map(row => row.slice(start, end).join('')));
    const prepared: [number[], string][] = problems.map(row => [extractNumbers(row.slice(0, -1)), row[row.length - 1]!.trim()]);
    return prepared;
}

function doHomework(prepared: [number[], string][]): number[] {
    return prepared.map(([operands, operator]) => {
        switch (operator) {
            case '+':
                return operands.reduce((a, b) => a + b, 0);
            case '*':
                return operands.reduce((a, b) => a * b, 1);
            default:
                throw new Error(`Unknown operator: ${operator}`);
        }
    });
}

function solution1(filename: string): void {
    const input = fs.readFileSync(filename, 'utf8');

    const sheet = input.split('\n').map(line => line.replace(/\s+/g, ' ').trim()).map(line => line.split(' ').map(part => part.trim()));
    const transposed = transpose(sheet);
    const prepared = prepareHomework(transposed);
    const anwers = doHomework(prepared);
    const sum = anwers.reduce((a, b) => a + b, 0);

    console.log(`[1] Answers sum: ${sum}`);
}

function solution2(filename: string): void {
    const input = fs.readFileSync(filename, 'utf8');

    const lines = input.split('\n');
    const sheet = lines.map(line => line.split(''));
    const ranges = problemRanges(sheet);
    const problems = splitAndPrepareProblems(sheet, ranges);
    const anwers = doHomework(problems);
    const sum = anwers.reduce((a, b) => a + b, 0);

    console.log(`[2] Answers sum: ${sum}`);
}

solution1('input/day6-1.txt');
solution1('input/day6-2.txt');
solution2('input/day6-1.txt');
solution2('input/day6-2.txt');
