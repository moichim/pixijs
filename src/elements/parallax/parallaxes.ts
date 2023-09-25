import { Tween } from "@tweenjs/tween.js";
import { Container, Resource, Sprite, Texture } from "pixi.js";
import { app } from "../../main";
import { Parallax } from "./parallax";
import { XYVal } from "../../utils/XYVal";

export class Parallaxes extends Container {

    public pan: XYVal = new XYVal( 0, 0 );
    public panAmount = new XYVal( 30, 30 );

    /** What is the difference between depth 0 and depth 1? */
    public _depthScaleFactor: number = 0;
    public get depthScaleFactor() { return this._depthScaleFactor; }
    public set depthScaleFactor( value: number ) {
        this._depthScaleFactor = value;
        this.parallaxes.map( item => item.applyParentDepth( value ) );
    }

    /** What is the difference between depth 0 and depth 1? */
    public _depthBlurFactor: number = 0.1;
    public get depthBlurFactor() { return this._depthScaleFactor; }
    public set depthBlurFactor( value: number ) {
        this._depthScaleFactor = value;
        this.parallaxes.map( item => item.applyParentBlur( value ) );
    }

    public bgColor: number = 0xf5b342;

     /** What is the difference between depth 0 and depth 1? */
     public _depthOverlayFactor: number = 0;
     public get depthOverlayFactor() { return this._depthScaleFactor; }
     public set depthOverlayFactor( value: number ) {
         this._depthOverlayFactor = value;
         this.parallaxes.map( item => item.applyParentOverlay( value ) );
     }

    /** What is the difference between depth 0 and depth 1? */
    public _depthShadowFactor: number = 0;
    public get depthShadowFactor() { return this._depthScaleFactor; }
    public set depthShadowFactor( value: number ) {
        this._depthShadowFactor = value;
        this.parallaxes.map( item => item.applyParentShadow( value ) );
    }

    /** What is the influence of the pan? */
    public _panAmount: number = 1;

    // declare children: Parallax[];

    public parallaxes: Parallax[] = [];

    constructor(
        /** The overall depth of the parallax set */
        protected bg?: Texture<Resource>
    ) {
        super();

        this.pivot.set( .5 );

        this.pan.onX = (value) => { this.parallaxes.map( item => item.pan.x = value ) };

        this.pan.onY = (value) => { this.parallaxes.map( item => item.pan.y = value ) };

        this.position.set( app.screen.width / 2, app.screen.height / 2 );


        window.addEventListener( "keydown", event => {
    
            if ( event.key === "ArrowLeft" ) {
                this.pan.x -= 1;
            }
            if ( event.key === "ArrowRight" ) {
                this.pan.x += 1;
            }
            if ( event.key === "ArrowDown" ) {
                this.pan.y += 1;
            }
            if ( event.key === "ArrowUp" ) {
                this.pan.y -= 1;
            }
        } );

        if ( this.bg ) {
            const bg = new Sprite( this.bg );
            bg.anchor.set(.5);
            this.addChild( bg );
        }
            

    }

    public setBgColor( color: number ) {
        this.bgColor = color;
        this.parallaxes.map( item => item.applyParentOverlay( color ) );
    }

    public addParallax( item: Parallax, options?: {
        x?: number,
        y?: number,
        depth?: number,
        color?: number,
        width?: number,
        height?: number
    } ) {

        this.addChild( item );
        this.parallaxes.push( item );

        item.bind();

        if ( options ) {
            if ( options.width ) item.dimension.x = options.width;
            if ( options.height ) item.dimension.y = options.height;
            if ( options.x ) item.pos.x = options.x;
            if ( options.y ) item.pos.y = options.y;
            if ( options.depth ) item.depth = options.depth;
            if ( options.color ) item.color = options.color;
        }

        item.applyParentDepth( this.depthScaleFactor );

        item.draw();

    }

}