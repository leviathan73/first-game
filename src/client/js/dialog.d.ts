export declare class Dialog {
    private _text;
    private _modal;
    private _lasttime;
    private _startTime;
    private _active;
    private _maskingDiv;
    get active(): boolean;
    set active(value: boolean);
    private _cb?;
    constructor();
    showDialog(text: string, isModal: boolean, shouldLast: number, cb?: Function): void;
    /**
     * If function returns true it means that player is frozen and shouldn't be animated
     */
    drawDialog(context: CanvasRenderingContext2D, w: number, h: number): boolean;
}
//# sourceMappingURL=dialog.d.ts.map