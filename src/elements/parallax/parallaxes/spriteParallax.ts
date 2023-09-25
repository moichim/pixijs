import { Container, Resource, Sprite, Texture } from "pixi.js";
import { Parallax } from "../parallax";
import { Tween } from "@tweenjs/tween.js";
import { app } from "../../../main";

/**
 * Vystavené parametry:
 * - color
 * - position
 * - depth
 * 
 * Přijímá parametry
 * - pan
 * - amount,
 * - fow
 */
export class SpriteParallax extends Parallax {

    public sprite!: Sprite;

    

    public constructor(
        public readonly image: Texture<Resource>
    ) {
        super();
        
    }

    createGraphics() {

        return new Container();
    
    }

    


    public draw() {

        this.sprite = new Sprite( this.image );
        this.sprite.pivot.set( .5 );
        this.sprite.anchor.set( .5);
        this.sprite.x = -100;

        this.graphics.addChild(  this.sprite );


    }

}