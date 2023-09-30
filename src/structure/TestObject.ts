import { Tween } from "@tweenjs/tween.js";
import { GameObject } from "./GameObject";
import { StaticTick } from "./Tick/StaticTick";
import { TweenTick } from "./Tick/TweenTick";

export class TestObject extends GameObject {

    value: number = 0;

    logger: StaticTick = new StaticTick( this, "logger" );

    tweener: TweenTick = new TweenTick( this, "tweener" );

    protected onInit() {

        this.ticks.add( this.logger );
        this.ticks.add( this.tweener );

        this.logger.frequency = 100;

        this.logger.callback = () => {
            console.log( "slyšíme se", this, this.value, this.ticks );
        }

        this.tweener.to( {
            value: 100
        }, 3000 )
            .yoyo(true)
            .repeat( 1 )
            .onUpdate( console.log )


        console.log( "Jsem tady", this );
        this.test();
    }

    test() {
        console.info( "jo, běžím!" );
    }

    protected onShow() {
        this.ticks.startAll();
        // this.ticks.stopAll();
    }

    beforeTween = () => {
        // console.log( "updatuji se", this.tween );
    }

}