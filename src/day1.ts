import * as fs from 'fs';

type Direction = 'L' | 'R';
type Rotation = { direction: Direction; distance: number };

function parseRotation(input: string): Rotation {
    const direction = input.charAt(0).toUpperCase() as Direction;
    const distance = parseInt(input.slice(1), 10);
    return { direction, distance };
}

function solution1(filename: string): number {
    const input = fs.readFileSync(filename, 'utf8');

    const rotations = input
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(parseRotation);

    let pos = 50;
    let password = 0;

    for (const rotation of rotations) {
        const { direction, distance } = rotation;

        if (direction === 'L') {
            pos -= distance;
        } else {
            pos += distance;
        }

        pos = (pos + 100) % 100;

        if (pos === 0 || pos === -0) {
            password += 1;
        }
    }

    console.log('Password:', password)

    return password;
}

solution1('input/day1-1.txt');
solution1('input/day1-2.txt');
