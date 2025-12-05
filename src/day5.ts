import * as fs from 'fs';

type Range = [number, number];

// invariant: start <= end
// @ts-ignore
function makeRange(start: number, end: number): Range {
    return [Math.min(start, end), Math.max(start, end)];
}

function inRange(value: number, range: Range): boolean {
    return value >= range[0] && value <= range[1];
}

function rangeLength([start, end]: Range): number {
    return end - start + 1;
}

type RangeUnion = Range[];

// range A contains range B or vice versa
// @ts-ignore
function rangeContainsRange([aStart, aEnd]: Range, [bStart, bEnd]: Range): boolean {
    return (aStart <= bStart && aEnd >= bEnd) || (bStart <= aStart && bEnd >= aEnd);
}

// range A touches or overlaps range B or vice versa; includes containment
function rangesOverlapOrTouch([aStart, aEnd]: Range, [bStart, bEnd]: Range): boolean {
    return (aEnd >= bStart && aStart < bEnd) || (bEnd >= aStart && bStart < aEnd) || (aStart === bStart && aEnd === bEnd);
}

// merge ranges A and B into a new range
function mergeRanges([aStart, aEnd]: Range, [bStart, bEnd]: Range): Range {
    return [Math.min(aStart, bStart), Math.max(aEnd, bEnd)];
}

// sort out ranges while not stable
function sortRanges(union: RangeUnion): RangeUnion {
    if (union.length <= 1) {
        return union;
    }

    for (let i = 0; i < union.length - 1; i++) {
        for (let j = i + 1; j < union.length; j++) {
            if (rangesOverlapOrTouch(union[i]!, union[j]!)) {
                const merged = mergeRanges(union[i]!, union[j]!);
                // a little bit of mutation a little bit of immutation
                let newUnion = union.filter((_, index) => index !== i && index !== j);
                newUnion.push(merged);
                return sortRanges(newUnion);
            }
        }
    }

    return union;
}

function solution1(filename: string): void {
    const input = fs.readFileSync(filename, 'utf8');
    const [rangesPart, idsPart] = input.split('\n\n');

    const ranges = rangesPart!
        .split('\n')
        .map(line => line.trim().split('-').map(Number) as Range);

    const ids = idsPart!
        .split('\n')
        .map(line => Number(line.trim()));

    const freshIds = ids.filter(id => ranges.some(range => inRange(id, range)));

    console.log(`[1] Fresh: ${freshIds.length}`);
}

function solution2(filename: string): void {
    const input = fs.readFileSync(filename, 'utf8');
    const [rangesPart] = input.split('\n\n');

    const ranges = rangesPart!
        .split('\n')
        .map(line => line.trim().split('-').map(Number) as Range);

    const rangeUnion = sortRanges(ranges);

    const totalLength = rangeUnion.reduce((acc, range) => acc + rangeLength(range), 0);

    console.log(`[2] Total length of ranges: ${totalLength}`);
}

solution1('input/day5-1.txt');
solution1('input/day5-2.txt');
solution2('input/day5-1.txt');
solution2('input/day5-2.txt');