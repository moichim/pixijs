import { BlurFilter, Container, Graphics } from "pixi.js";
import { Parallaxes } from "./parallaxes";
import { XYVal } from "../../utils/XYVal";
import { Tween } from "@tweenjs/tween.js";
import { ColorOverlayFilter, DropShadowFilter } from "pixi-filters";
import { app } from "../../main";

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
export abstract class Parallax extends Container {

    public amount: number = 1;

    declare parent: Parallaxes;

    public panner: Container = new Container;
    public centerer: Container = new Container;

    public graphics!: Container;

    public dimension = new XYVal();
    public pan: XYVal = new XYVal();
    public pos: XYVal = new XYVal();

    public tween = new Tween( this );

    public blur = new BlurFilter( 0 );
    public overlay = new ColorOverlayFilter( 0xff00ff, 0 );
    public shadow = new DropShadowFilter( {
        alpha: 0,
        offset: {x:0,y:0},
        blur: 5
    } );

    public constructor() {
        super();
        
        this.pivot.set( 0.5 );

        // Setup panner
        this.panner.pivot.set( 0.5 );

        // Setup centerer
        this.centerer.pivot.set( 0.5 );

        // Setup graphics
        this.graphics = this.createGraphics();
        this.graphics.pivot.set( 0.5 );

        // Bind it all together
        this.panner.addChild( this.centerer );
        this.centerer.addChild( this.graphics );
        this.addChild( this.panner );

        // Apply filters
        this.graphics.filters = [ 
            this.overlay, 
            this.blur,
            this.shadow
        ];

        this.tween = new Tween( this );
    }

    startTween() {

        const limit = ( this.depth ) / ( ( Math.random() * 50 )  - 100 ) ;
        const timing = Math.abs( Math.random() * 3000 ) + 2000;
        const rotate = (Math.random() - 2 + 1 ) * 0.1;

        this.tween.to( { 
            graphics: {
                x: limit,
                rotation: rotate
            },
        }, timing )
            .yoyo( true )
            .repeat( Infinity )
            .start();

        app.ticker.add( () => {
            this.tween.update()
        } );

    }

    protected abstract createGraphics(): Container;

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

    }

    public abstract draw(): void;

}