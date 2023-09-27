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

    declare parent: Parallaxes;

    // Containers

    /** Container handling the pan (the xy shift depending on the global pan) */
    public panner: Container = new Container;
    /** Container handling the position relative to the scene */
    public positioner: Container = new Container;
    /** Main content of the parallax */
    public content!: Container;

    // Movable attributes

    /** The optional content size */
    public dimension = new XYVal();
    /** Mirror of the current pan */
    public pan: XYVal = new XYVal();
    /** Position relative to the scene. Manifests itself in `this.positioner` */
    public pos: XYVal = new XYVal();

    /** Animation instance */
    public tween!: Tween<Parallax>;

    // Filters

    public blur = new BlurFilter( 0, 2 );
    public overlay = new ColorOverlayFilter( 0xff00ff, 0 );

    // State variables

    protected binded: boolean = false;

    public constructor() {
        super();
        
        this.pivot.set( 0.5 );

        // Setup panner
        this.panner.pivot.set( 0.5 );

        // Setup centerer
        this.positioner.pivot.set( 0.5 );

        // Setup graphics
        this.content = this.createContentElement();
        this.content.pivot.set( 0.5 );

        // Bind it all together
        this.panner.addChild( this.positioner );
        this.positioner.addChild( this.content );
        this.addChild( this.panner );

        // Apply filters
        this.content.filters = [ 
            this.overlay, 
            this.blur
        ];

        this.tween = new Tween( this );
    }

    startTween() {

        const limit = ( this.depth ) / ( ( Math.random() * 50 )  - 100 ) ;
        const timing = Math.abs( Math.random() * 3000 ) + 2000;
        const rotate = (Math.random() - 2 + 1 ) * 0.1;

        this.tween.to( { 
            content: {
                x: limit,
                rotation: rotate
            },
        }, timing )
            .yoyo( true )
            .repeat( Infinity )
            .start();

        app.ticker.add( () => {
            // this.tween.update()
        } );

    }

    /** Build the main content. CALLED IN CONSTRUCTOR => NO PARENT CALLS */
    protected abstract createContentElement(): Container;

    /** Activates listeners after this item is binded to its parent. */
    public addListeners() {

        if ( this.binded === false ) {

            this.overlay.color = this.parent.bgColor;

            /** What to do when `pan.x` is changed. */
            this.pan.onX = ( value ) => {
                this.panner.x = value * this.parent.perspective.x;
            }

            /** What to do when `pan.y` is changed. */
            this.pan.onY = ( value ) => {
                this.panner.y = value * this.parent.perspective.y;
            }

            /** What to do when `pos.x` is changed. */
            this.pos.onX = ( value ) => {
                this.positioner.x = value;
            }

            /** What to do when `pos.y` is changed. */
            this.pos.onY = ( value ) => {
                this.positioner.y = value;
            }

            /** What to do when `dimension.x` changes. @todo */
            this.dimension.onX = () => {
                // this.mount();
            }

            /** What to do when `dimension.y` changes. @todo */
            this.dimension.onY = () => {
            }


        }

    }

    /** Draw the content to the screen */
    public abstract mount(): void;

    protected _color: number = 0xffffff;
    public get color() { return this._color; }
    public set color( value: number ) {
        this._color = value;
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
        this.overlay.alpha = value * this.depth;
    }

    

    

    

    

}