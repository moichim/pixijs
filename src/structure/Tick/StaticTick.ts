import { Container } from "pixi.js";
import { app } from "../../main";
import { TickItem } from "./TickItem";

enum StaticTickState {
    IDLE = 1,
    ON = 2,
    PAUSE = 3,
    STOP = 4
}

export class StaticTick<T extends Container = Container> implements TickItem {

    protected state: StaticTickState = StaticTickState.IDLE;

    protected time: number = 0;

    protected _frequency: number = 1;
    public get frequency() { return this._frequency }
    public set frequency(value: number) {
        if (value === 0) value = 1;
        this._frequency = Math.floor( Math.abs(value) );
    }

    protected _callback?: CallableFunction;
    public get callback(): CallableFunction | undefined { return this._callback; }
    public set callback(value: CallableFunction | undefined) {
        this._callback = value;
    }

    constructor(
        public readonly object: T,
        public readonly key: string,
        public loopInterval: number = 10 * 1000
    ) {}

    register() {
        app.addTick( this.object, this.key, this.update.bind( this ) );
    }

    unregister() {
        app.removeTick( this.object, this.key, this.update )
    };

    update() {

        // Do the update
        if (this.callback) {
            if (this.state === StaticTickState.ON) {

                if (this.frequency === 1)
                    this.callback();
                else if ( ( this.time % this.frequency ) === 0)
                    this.callback();

            }
        }

        // Increment time
        if (this.time > this.loopInterval)
            this.time = 0;
        else
            this.time = this.time + 1;

    };


    start() {
        this.state = StaticTickState.ON;
    }

    stop() {
        this.state = StaticTickState.STOP;
    }

    pause() {
        this.state = StaticTickState.PAUSE;
    };

    resume() {
        this.state = StaticTickState.ON;
    }


}