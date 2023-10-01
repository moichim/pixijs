import { Tween } from "@tweenjs/tween.js";
import { Container } from "pixi.js";
import { app } from "../../main";
import { TickItem } from "./TickItem";

export class TweenTick<T extends Container = Container> implements TickItem {

    public tween!: Tween<T>;

    constructor(
        public readonly object: T,
        public readonly key: string
    ) {
        this.tween = new Tween( this.object );
    }

    public register() {
        
        if ( this.tween )
            app.addTick( this.object, this.key, this.update.bind( this ) );
    }

    public unregister() {
        app.removeTick( this.object, this.key, this.update );
    }

    public to( state: any, duration: number ): Tween<T> {
        this.tween.stop()
            .to( state, duration );
        return this.tween;
    }

    public update() {
        if ( this.tween ) 
        if ( this.tween.isPlaying() )
            this.tween.update();
    }

    public start() {
        this.tween.start();
    }

    public stop() {
        this.tween.stop();
    }

    public pause() {
        this.tween.pause();
    }

    public resume() {
        this.tween.resume();
    }


}