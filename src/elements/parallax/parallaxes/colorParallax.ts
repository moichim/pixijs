import { BlurFilter, Container, Graphics, Sprite } from "pixi.js";
import { Tween } from "@tweenjs/tween.js";
import { ColorOverlayFilter, DropShadowFilter } from "pixi-filters";
import { Parallaxes } from "../parallaxes";
import { XYVal } from "../../../utils/XYVal";
import { Parallax } from "../parallax";

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
export class ColorParallax extends Parallax {

    declare graphics: Graphics;
    public sprite!: Sprite;


    public constructor() {
        super();
    }

    createGraphics() {
        return new Graphics();
    }


    public draw() {
        this.graphics.x = -this.dimension.x / 2;
        this.graphics.y = -this.dimension.y / 2;

        this.graphics.beginFill( this.color );
        this.graphics.drawRect( 0, 0, this.dimension.x, this.dimension.y );
    }

}