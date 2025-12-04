import * as fs from 'fs';

type Empty = '.';
type Roll = '@';
type Cell = Empty | Roll;
type Grid = Cell[][];

function parseGrid(input: string): Grid {
    return input.trim().split('\n').map(line => line.trim().split('') as Cell[]);
}

// @ts-ignore
function _printGrid(grid: Grid): void {
    console.log('[1] Grid size:', grid.length, 'x', grid[0]?.length || 0);
    for (const row of grid) {
        console.log(row.join(''));
    }
}

function canAccess(grid: Grid, x: number, y: number): boolean {
    const rows = grid.length;
    const cols = grid[0]?.length || 0;
    if (grid[y]![x] !== '@') {
        return false;
    }

    let rolls = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) {
                continue;
            }
            let nx = x + i;
            let ny = y + j;
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && grid[ny]![nx] === '@') {
                rolls += 1;
            }
        }
    }
    return rolls < 4;
}

function findAccessibleRolls(grid: Grid): [number, number][] {
    let rolls: [number, number][] = [];
    const rows = grid.length;
    const cols = grid[0]?.length || 0;
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (grid[y]![x] === '@' && canAccess(grid, x, y)) {
                rolls.push([x, y]);
            }
        }
    }
    return rolls;
}

function removeRoll(grid: Grid, x: number, y: number): void {
    grid[y]![x] = '.';
}

function removeRolls(grid: Grid, rolls: [number, number][]): void {
    for (const [x, y] of rolls) {
        removeRoll(grid, x, y);
    }
}

function solution1(filename: string): void {
    const input = fs.readFileSync(filename, 'utf8');
    const grid = parseGrid(input);
    //printGrid(grid);
    const accessibleRolls = findAccessibleRolls(grid).length;
    console.log('[1] Accessible rolls:', accessibleRolls);
}

function solution2(filename: string): void {
    const input = fs.readFileSync(filename, 'utf8');
    const grid = parseGrid(input);
    let totalRemoved = 0;
    while (true) {
        //printGrid(grid);
        // find rolls for removal
        const accessibleRolls = findAccessibleRolls(grid);
        if (accessibleRolls.length === 0) {
            break;
        }
        removeRolls(grid, accessibleRolls);
        totalRemoved += accessibleRolls.length;
    }
    console.log('[2] Total removed rolls:', totalRemoved);
}

solution1('input/day4-1.txt');
solution1('input/day4-2.txt');
solution2('input/day4-1.txt');
solution2('input/day4-2.txt');