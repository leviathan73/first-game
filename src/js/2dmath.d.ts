export declare class Point {
    x: number;
    y: number;
    constructor(x: number, y: number);
    vectorTo(p: {
        x: number;
        y: number;
    }): Vector;
    add(v: {
        x: number;
        y: number;
    }): Point;
}
export declare class Position {
    x: number;
    y: number;
    constructor(x: number, y: number);
    inBox(x1: number, y1: number, x2: number, y2: number): boolean;
    vectorTo(p: {
        x: number;
        y: number;
    }): Vector;
    add(v: Vector): Position;
}
export declare class Vector {
    x: number;
    y: number;
    constructor(x: number, y: number);
    copy(): Vector;
    magnitude(): number;
    normalize(): Vector;
    normalize2(): void;
    setMagnitude(m: number): Vector;
    setMagnitude2(m: number): void;
    angle(): number;
    rotate(beta: number): Vector;
    rotate2(beta: number): void;
    multiply(by: number): Vector;
    divide(by: number): Vector;
    add(v: Vector): Vector;
}
export declare class Box {
    x: number;
    y: number;
    constructor(x: number, y: number);
}
//# sourceMappingURL=2dmath.d.ts.map