import { Application, ICanvas } from "pixi.js";
import { GameScreenManager } from "./Screen/GameScreenManager";

export type TickFn = (() => any);

export class Game<VIEW extends ICanvas = ICanvas> extends Application<VIEW> {


    public readonly manager: GameScreenManager = new GameScreenManager;




    /** Map of running ticks */
    ticks = new Map<Object, Map<string, TickFn>>;

    /** Adds a tick if not already added */
    addTick(
        object: Object,
        key: string,
        fn: TickFn
    ): boolean {

        if ( this.ticks.has( object ) ) {

            if ( this.ticks.get( object )!.has( key ) === false ) {

                this.ticks.get( object )!.set( key, fn );
                this.ticker.add( fn );
                return true;

            }

            return false;

        }

        else {

            this.ticks.set( object, new Map );
            this.ticks.get( object )!.set( key, fn );
            this.ticker.add( fn );
            return true;

        }

    }

    /** Remove a tick */
    removeTick(
        object: Object,
        key: string,
        fn: TickFn
    ) {

        if (!this.ticks.has(object))

            return false;

        const map = this.ticks.get(object);

        if (map!.has(key)) {
            map!.delete(key);
            this.ticker.remove(fn);
        }

        if (map?.size === 0) {
            this.ticks.delete(object);
        }

        return true;

    }

    hasTick(
        object: Object,
        key: string
    ): boolean {

        if (!this.ticks.has(object))
            return false;

        const map = this.ticks.get(object);

        return map!.has(key);

    }

}