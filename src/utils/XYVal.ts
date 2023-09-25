
export class XYVal {

    public constructor(
        protected _x: number = 0,
        protected _y: number = 0
    ) { }

    public onX?: (value: number) => void;
    public get x() { return this._x; }
    public set x(value: number) {
        this._x = value;
        if (this.onX)
            this.onX(value);
    }

    public onY?: (value: number) => void;
    public get y() { return this._y; }
    public set y(value: number) {
        this._y = value;
        if (this.onY)
            this.onY(value);
    }

    public get value() {
        return { x: this._x, y: this._y };
    }

    public set(value: { x?: number; y?: number; }) {
        if (value.x)
            this.x = value.x;
        if (value.y)
            this.y = value.y;
    }


}
