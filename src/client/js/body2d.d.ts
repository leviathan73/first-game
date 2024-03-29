import { Vector, Position } from "./2dmath";
export declare class Body2d {
    p: Position;
    v: Vector;
    a: Vector;
    f: Vector;
    d: Vector;
    omega: number;
    aa: number;
    af: number;
    m: number;
    radius: number;
    freeze: boolean;
    private _ghost;
    dt: number;
    get ghost(): boolean;
    set ghost(value: boolean);
    static debug: boolean;
    private _lastupdate;
    get lastupdate(): number;
    static speedfactor: number;
    private _fps;
    getFPSString(): string;
    constructor();
    /**
     * Nadaje siłę obracającą
     * @param {number} force najlepiej zaczynać od wartości od 0 do 1
     */
    setTorgueForce(force: number): void;
    /**
     * ustawia przyśpieszenie obrotowe
     * @param {number} aa najlepiej zaczynać od wartości od 0 do 1
     */
    setAngularAcceleration(aa: number): void;
    /**
     * ustawia prędkość obrotową
     * @param {number} omega najlepiej zaczynać od wartości od 0 do 1
     */
    setAngularVelocity(omega: number): void;
    addForce(force: Vector): void;
    setForce(x: number, y: number): void;
    /**
     * @param {number} r
     */
    setRadius(r: number): void;
    setPosition(x: number, y: number): void;
    setPosition2(p: Position): void;
    setDirection(x: number, y: number): void;
    setDirection2(d: Vector): void;
    setAcceleration(x: number, y: number): void;
    setVelocity(x: number, y: number): void;
    setVelocity2(v: Vector): void;
    setMass(m: number): void;
    update(): void;
    drawdebug(context: CanvasRenderingContext2D): void;
    draw(context: CanvasRenderingContext2D): void;
    /**
     *
     * @param {Body2d} intruder
     * @returns {boolean}
     */
    checkCollision(/** @type {Body2d} */ intruder: Body2d): boolean;
}
//# sourceMappingURL=body2d.d.ts.map