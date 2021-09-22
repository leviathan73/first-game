import { Position, Vector } from "./2dmath";
import { Body2d } from "./body2d";
import * as THREE from "three";
export declare class Ship extends Body2d {
    angle: number;
    mesh: THREE.Mesh;
    turnLeft(): void;
    turnRight(): void;
    audio: null;
    constructor();
    getMesh(): void;
    makeGhost(miliseconds: number): void;
    update(): void;
    draw(context: CanvasRenderingContext2D): void;
    drawShipBody(context: CanvasRenderingContext2D, noFill: boolean): void;
    drawEngine(context: CanvasRenderingContext2D): void;
    shoot(): void;
}
export declare class Meteor extends Body2d {
    _baseSpeed: number;
    constructor(size: number);
    helper: null;
    shapeSteps: {
        x: number;
        y: number;
    }[];
    shapeSteps1: {
        x: number;
        y: number;
    }[];
    shapeSteps2: {
        x: number;
        y: number;
    }[];
    shapeSteps3: {
        x: number;
        y: number;
    }[];
    randomizeInitialParams(w: number, h: number): void;
    setRadius(r: number): void;
    generateShape(): void;
    size: number;
    explode(shootVector: Vector): Array<Meteor>;
    draw(context: CanvasRenderingContext2D): void;
}
export declare class Bullet extends Body2d {
    constructor();
    draw(context: CanvasRenderingContext2D): void;
}
export declare class Ufo extends Body2d {
    shootAt(p: Position): Bullet;
    startUfo(_canvasWidth: number, _canvasHeight: number): void;
    constructor(time: number);
    draw(ctx: CanvasRenderingContext2D): void;
    update(): void;
    stopUfo(): void;
}
//# sourceMappingURL=actors.d.ts.map