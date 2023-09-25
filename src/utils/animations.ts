import { Tween } from "@tweenjs/tween.js";

class AnimationManager {
    
    protected tweens: Tween<any>[] = [];
    
    constructor() {

    }

    add<T = any>(
        value: T,
        to: T,
        // callback: () => void
    ): Tween<{value:T}> {

        const tween = new Tween<{value:T}>( {value} )
            .to({to}, 2000)
            .onUpdate( console.log )
            .onComplete(console.log);

        this.tweens.push( tween );

        return tween;

    }

    update() {
        this.tweens.forEach( tween => tween.update() );
    }
}

export const animationManager = new AnimationManager;
