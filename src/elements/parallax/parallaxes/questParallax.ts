import { Container, Resource, Sprite, Texture } from "pixi.js";
import { Parallax } from "../parallax";
import { Tween } from "@tweenjs/tween.js";
import { app } from "../../../main";
import { SpriteParallax } from "./spriteParallax";

export class QuestParallax extends SpriteParallax {

    public numbers: Container[] = [];

    protected occupied: number[] = [];

    public constructor(
        public readonly image: Texture<Resource>,
        public readonly slots: number[]
    ) {
        super( image );
        
    }

    public addNumber( number: number ) {

        const free = this.pickFreeSlot();

        if ( free === false ) {
            throw new Error;
        }

        const item = new Number();
        this.numbers.push( item );

        this.addChild( number );

    }

    protected pickFreeSlot() {

        const free = this.slots
            .filter( item => ! this.occupied.includes( item ) )
            .sort( (a,b) => Math.random() - 0.5 );

        if ( free.length === 0 ) 
            return false;

        return free;

    }

}