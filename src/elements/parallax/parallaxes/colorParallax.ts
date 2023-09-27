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

    declare content: Graphics;
    public sprite!: Sprite;


    public constructor() {
        super();
    }

    createContentElement() {
        return new Graphics();
    }


    public mount() {
        this.content.x = -this.dimension.x / 2;
        this.content.y = -this.dimension.y / 2;

        this.content.beginFill( this.color );
        this.content.drawRect( 0, 0, this.dimension.x, this.dimension.y );
    }

}