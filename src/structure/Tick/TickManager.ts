import { GameObject } from "../GameObject";
import { TickItem } from "./TickItem";

export class TweenManager {

    protected readonly ticks: Map<string,TickItem> = new Map;

    constructor(
        public readonly object: GameObject
    ) {

    }

    /** Add a tick */
    public add(
        tick: TickItem,
    ) {
        if ( ! this.ticks.has( tick.key ) ) {
            this.ticks.set( tick.key, tick );
            tick.register();
        }
    }

    /** Remove a tick */
    public remove( tween: TickItem|string ) {

        const key = typeof tween === "string"
            ? tween
            : tween.key

        this.ticks.get( key )?.unregister();
        this.ticks.delete( key );

    }

    registerAll() {
        for ( const tick of this.ticks.values() ) {
            tick.register();
        }
    }

    startAll() {
        for ( const tick of this.ticks.values() ) {
            tick.start();
        }
    }

    stopAll() {
        for ( const tick of this.ticks.values() ) {
            tick.stop();
        }
    }

    pauseAll() {
        for ( const tick of this.ticks.values() ) {
            tick.pause();
        }
    }

    resumeAll() {
        for ( const tick of this.ticks.values() ) {
            tick.resume();
        }
    }

    /** Destroy and delete all running ticks */
    public destroy() {
        this.ticks.forEach( item => {
            const key = item.key;
            item.unregister();
            this.ticks.delete( key );
        } );
    }

    update() {
        if ( this.ticks )
        for ( const tick of this.ticks.values() ) {
            tick.update.call( this.object );
        }
    }

}