import { Tween } from "@tweenjs/tween.js";
import { Container, Resource, Sprite, Texture } from "pixi.js";
import { app } from "../../main";
import { Parallax } from "./parallax";
import { XYVal } from "../../utils/XYVal";
import { AppScreen } from "../../utils/routing";

export class Parallaxes extends Container {

    declare parent: AppScreen;

    /** List of contained parallaxes. */
    public parallaxes: Parallax[] = [];

    public pan: XYVal = new XYVal( 0, 0 );
    public perspective = new XYVal( 30, 30 );

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

    

    constructor(
        /** The overall depth of the parallax set */
        protected bg?: Texture<Resource>
    ) {
        super();

        this.pivot.set( .5 );

        this.pan.onX = (value) => { this.parallaxes.map( item => item.pan.x = value ) };

        this.pan.onY = (value) => { this.parallaxes.map( item => item.pan.y = value ) };

        this.position.set( app.screen.width / 2, app.screen.height / 2 );

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

    /** Parallaxes must be added only after the parallax itself is added to the scene. */
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

        item.addListeners();

        if ( options ) {
            if ( options.width ) item.dimension.x = options.width;
            if ( options.height ) item.dimension.y = options.height;
            if ( options.x ) item.pos.x = options.x;
            if ( options.y ) item.pos.y = options.y;
            if ( options.depth ) item.depth = options.depth;
            if ( options.color ) item.color = options.color;
        }

        item.applyParentDepth( this.depthScaleFactor );

        item.mount();

    }

}