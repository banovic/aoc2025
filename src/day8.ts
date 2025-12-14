import * as fs from 'fs';


// @ts-ignore
function distance(a: [number, number, number], b: [number, number, number]): number {
    return Math.sqrt(
        (a[0]! - b[0]!) ** 2 +
        (a[1]! - b[1]!) ** 2 +
        (a[2]! - b[2]!) ** 2
    );
}

// @ts-ignore
function allDistances(boxes: [string, [number, number, number]][]): Map<string, [string, string]> {
    const distances: Map<string, [string, string]> = new Map();
    for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
            const dist = distance(boxes[i]![1]!, boxes[j]![1]!);
            const key = dist.toString();
            if (!distances.has(key)) {
                distances.set(key, [boxes[i]![0]!, boxes[j]![0]!]);
            } else {
                throw new Error('Duplicate distance found: ' + key);
            }
        }
    }
    return distances;
}

// @ts-ignore
function threeLargestCircuts(boxes: [string, [number, number, number]][], n: number): Set<string>[] {
    const circuts: Set<string>[] = [];
    boxes.forEach(box => {
        const circut: Set<string> = new Set();
        circut.add(box[0]!);
        circuts.push(circut);
    });
    const distances = allDistances(boxes);

    //console.log(circuts);
    // sorted keys by distance
    // @ts-ignore
    const shortestDistances = Array.from(distances.keys()).sort((a, b) => parseFloat(a) - parseFloat(b)).slice(0, n);

    for (const distKey of shortestDistances) {

        const [boxA, boxB] = distances.get(distKey)!;

        for (const circut of circuts) {
            // both in the same circut - nop
            if (circut.has(boxA) && circut.has(boxB)) {
                break
            }

            // one in one circut, other in another - merge
            if (circut.has(boxA)) {
                const otherCircut = [...circuts].find(c => c.has(boxB));
                if (otherCircut) {
                    // other circut found - merge
                    otherCircut.forEach(b => circut.add(b));
                    circuts.splice(circuts.indexOf(otherCircut), 1);
                    break
                } else {
                    throw new Error(`Box ${boxB} not found in any circut`);
                }
            }

            // one in one circut, other in another - merge
            if (circut.has(boxB)) {
                const otherCircut = [...circuts].find(c => c.has(boxA));
                if (otherCircut) {
                    // other circut found - merge
                    otherCircut.forEach(a => circut.add(a));
                    circuts.splice(circuts.indexOf(otherCircut), 1);
                    break
                } else {
                    throw new Error(`Box ${boxA} not found in any circut`);
                }
            }
        }
    }

    return circuts;
}

// @ts-ignore
function lastConnections(boxes: [string, [number, number, number]][]): [string, string] | null {
    const circuts: Set<string>[] = [];
    boxes.forEach(box => {
        const circut: Set<string> = new Set();
        circut.add(box[0]!);
        circuts.push(circut);
    });

    const distances = allDistances(boxes);
    const shortestDistances = Array.from(distances.keys()).sort((a, b) => parseFloat(a) - parseFloat(b));

    for (const distKey of shortestDistances) {

        const [boxA, boxB] = distances.get(distKey)!;

        for (const circut of circuts) {
            // both in the same circut - nop
            if (circut.has(boxA) && circut.has(boxB)) {
                break
            }

            // one in one circut, other in another - merge
            if (circut.has(boxA)) {
                const otherCircut = [...circuts].find(c => c.has(boxB));
                if (otherCircut) {
                    // other circut found - merge
                    otherCircut.forEach(b => circut.add(b));
                    circuts.splice(circuts.indexOf(otherCircut), 1);
                    break
                } else {
                    throw new Error(`Box ${boxB} not found in any circut`);
                }
            }

            // one in one circut, other in another - merge
            if (circut.has(boxB)) {
                const otherCircut = [...circuts].find(c => c.has(boxA));
                if (otherCircut) {
                    // other circut found - merge
                    otherCircut.forEach(a => circut.add(a));
                    circuts.splice(circuts.indexOf(otherCircut), 1);
                    break
                } else {
                    throw new Error(`Box ${boxA} not found in any circut`);
                }
            }
        }

        if (circuts.length === 1) {
            return [boxA, boxB]
        }
    }

    return null;
}

function solution1(filename: string) {
    const input = fs.readFileSync(filename, 'utf-8');

    const boxes: [string, [number, number, number]][] = input.trim().split('\n').map(line => {
        const coors = line.split(',').map(Number);
        return [line, [coors[0]!, coors[1]!, coors[2]!]];
    });

    const circuts = threeLargestCircuts(boxes, 10);
    console.log(`[1] Product of three largest circuts sizes: ${circuts.map(c => c.size).sort((a, b) => b - a).slice(0, 3).reduce((a, b) => a * b, 1)}`);
}

function solution2(filename: string) {
    const input = fs.readFileSync(filename, 'utf-8');

    const boxes: [string, [number, number, number]][] = input.trim().split('\n').map(line => {
        const coors = line.split(',').map(Number);
        return [line, [coors[0]!, coors[1]!, coors[2]!]];
    });

    const circuts = threeLargestCircuts(boxes, 1000);
    console.log(`[1] Product of three largest circuts sizes: ${circuts.map(c => c.size).sort((a, b) => b - a).slice(0, 3).reduce((a, b) => a * b, 1)}`);
}

function solution3(filename: string) {
    const input = fs.readFileSync(filename, 'utf-8');

    const boxes: [string, [number, number, number]][] = input.trim().split('\n').map(line => {
        const coors = line.split(',').map(Number);
        return [line, [coors[0]!, coors[1]!, coors[2]!]];
    });

    const last2Boxes = lastConnections(boxes);
    if (!last2Boxes) {
        throw new Error('Could not find last two boxes');
    }
    const [boxA, boxB] = last2Boxes;
    const x1 = boxA.split(',').map(Number)[0]!;
    const x2 = boxB.split(',').map(Number)[0]!;
    console.log(`[2] Last two boxes to connect: ${boxA} and ${boxB}, product of first coordinates: ${x1 * x2}`);
}

solution1('input/day8-1.txt');
solution2('input/day8-2.txt');
solution3('input/day8-1.txt');
solution3('input/day8-2.txt');