import { BlurFilter, COLOR_MASK_BITS, Container, Graphics } from "pixi.js";
import { Parallaxes } from "./parallaxes";
import { XYVal } from "../../utils/XYVal";
import { animationManager } from "../../utils/animations";
import { Tween } from "@tweenjs/tween.js";
import { app } from "../../main";
import { ColorOverlayFilter, DropShadowFilter } from "pixi-filters";

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
export class Parallax extends Container {

    public amount: number = 1;

    declare parent: Parallaxes;

    public panner: Container = new Container;
    public centerer: Container = new Container;

    public graphics = new Graphics();

    public dimension = new XYVal();
    public pan: XYVal = new XYVal();
    public pos: XYVal = new XYVal();

    public tween = new Tween( this );

    public blur = new BlurFilter( 0, 20 );
    public overlay = new ColorOverlayFilter( 0xff00ff, 1 );
    public shadow = new DropShadowFilter( {
        alpha: 0,
        offset: {x:0,y:0},
        blur: 5
    } );

    protected _color: number = 0xffffff;
    public get color() { return this._color; }
    public set color( value: number ) {
        this._color = value;
        this.draw();
    }

    public get overlayColor() {
        return this.parent.bgColor;
    }
    public set overlayColor( value: number ) {
        this.overlay.color = value;
    }

    protected _depth: number = 0;
    get depth() { return this._depth; }
    set depth( value: number ) {

        this._depth = value;
        return;

    }

    protected d: number = 0;

    protected _depthScale = 1;

    protected getNegativeAspect( 
        parentValue: number, 
        min: number|undefined = 0, 
        max: number|undefined = undefined
    ) {

        let aspect = 1 - ( parentValue * this.depth );
        if ( min !== undefined )
        if ( aspect < min )
            aspect = min;

        if ( max !== undefined )
        if ( aspect > max )
            aspect = max;

        return aspect;

    }

    protected getPositiveAspect( 
        parentValue: number, 
        min: number|undefined = 0, 
        max: number|undefined = undefined
    ) {

        let aspect = 1 - ( parentValue * this.depth );
        if ( min !== undefined )
        if ( aspect < min )
            aspect = min;

        if ( max !== undefined )
        if ( aspect > max )
            aspect = max;

        return aspect;

    }

    public applyParentDepth( value: number ) {

        const depthScale = this.getNegativeAspect( value, 0 );

        this.scale.set( depthScale );

    }

    public applyParentBlur( value: number ) {
        this.blur.blur = value * this.depth;
    }

    public applyParentOverlay( value: number ) {
        this.overlay.alpha = value * this.depth; // this.getNegativeAspect( value );
    }

    public applyParentShadow( value: number ) {
        this.shadow.alpha = value;
    }

    protected binded: boolean = false;

    public constructor() {
        super();
        this.pivot.set( 0.5 );
        this.panner.pivot.set( 0.5 );
        this.centerer.pivot.set( 0.5 );
        this.graphics.pivot.set( 0.5 );

        this.panner.addChild( this.centerer );
        this.centerer.addChild( this.graphics );
        this.addChild( this.panner );

        this.graphics.filters = [ 
            this.overlay, 
            this.blur,
            // this.shadow,
        ];
    }

    public bind() {

        if ( this.binded === false ) {

            this.overlay.color = this.parent.bgColor;

            this.pan.onX = ( value ) => {
                
                // Nastaví pozici grafiky
                this.panner.x = value * this.parent.panAmount.x;

            }

            this.pan.onY = ( value ) => {
                
                // Nastaví pozici grafiky
                this.panner.y = value * this.parent.panAmount.y;

            }

            this.pos.onX = ( value ) => {
                
                this.centerer.x = value;
            }

            this.pos.onY = ( value ) => {
                this.centerer.y = value;
            }

            this.dimension.onX = () => {
                this.draw();
            }
            this.dimension.onY = () => {
                this.draw();
            }


        }

        const tween = new Tween( this )
            .to( {depth: 5}, 4000 )
            .yoyo( true )
            .repeat( Infinity )
            .start();

        // app.ticker.add( () => tween.update() );

    }

    protected resetContainer() {
        this.pivot.set( .5 );
    }

    public draw() {

        // console.log( this );

        this.graphics.x = -this.dimension.x / 2;
        this.graphics.y = -this.dimension.y / 2;

        this.graphics.beginFill( this.color );
        this.graphics.drawRect( 0, 0, this.dimension.x, this.dimension.y );

    }

}