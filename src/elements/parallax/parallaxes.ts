import { Tween } from "@tweenjs/tween.js";
import { Container } from "pixi.js";
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
        this.children.map( item => item.applyParentDepth( value ) );
    }

    /** What is the difference between depth 0 and depth 1? */
    public _depthBlurFactor: number = 0.1;
    public get depthBlurFactor() { return this._depthScaleFactor; }
    public set depthBlurFactor( value: number ) {
        this._depthScaleFactor = value;
        this.children.map( item => item.applyParentBlur( value ) );
    }

    public bgColor: number = 0xffff00;

     /** What is the difference between depth 0 and depth 1? */
     public _depthOverlayFactor: number = 0;
     public get depthOverlayFactor() { return this._depthScaleFactor; }
     public set depthOverlayFactor( value: number ) {
         this._depthOverlayFactor = value;
         this.children.map( item => item.applyParentOverlay( value ) );
     }

    /** What is the difference between depth 0 and depth 1? */
    public _depthShadowFactor: number = 0;
    public get depthShadowFactor() { return this._depthScaleFactor; }
    public set depthShadowFactor( value: number ) {
        this._depthShadowFactor = value;
        this.children.map( item => item.applyParentShadow( value ) );
    }

    /** What is the influence of the pan? */
    public _panAmount: number = 1;

    declare children: Parallax[];

    constructor(
        /** The overall depth of the parallax set */
    ) {
        super();

        this.pivot.set( .5 );

        this.pan.onX = (value) => { this.children.map( item => item.pan.x = value ) };

        this.pan.onY = (value) => { this.children.map( item => item.pan.y = value ) };

        this.position.set( app.screen.width / 2, app.screen.height / 2 );

        this.addParallax( new Parallax, {
            color: 0x12345,
            depth: 5,
            y: 0,
            x: -100,
            height: 200,
            width: 100
        } );

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

        this.addParallax( new Parallax, {
            color: 0xff00ff,
            depth: 2,
            y: 20,
            x: 0,
            height: 500,
            width: 1500
        } );

        this.addParallax( new Parallax, {
            color: 0x00ff00,
            depth: 1,
            y: -400,
            x: 0,
            height: 200,
            width: 1500
        } );

        this.addParallax( new Parallax, {
            color: 0xff0000,
            depth: 0,
            y: 60,
            x: 100,
            height: 200,
            width: 100
        } );

        this.addParallax( new Parallax, {
            color: 0x0000ff,
            depth: -1,
            y: 60,
            x: 100,
            height: 200,
            width: 100
        } );

        this.pan.x = -10;
        this.pan.y = -10;

        // this.depthScaleFactor = 2;

        const amount = new Tween( this )
            .to( { 
                _depthBlurFactor: 10,
                _depthScaleFactor: 0.1,
                _depthOverlayFactor: 0.1,
                pan: {
                    x: 10,
                    y: 10
                },
                // bgColor: 0x00ffff,
                _depthShadowFactor: 1
            }, 5000 )
            //.yoyo( true )
            // .repeat( 1 )
            .onUpdate( (value) => {
                this.depthScaleFactor = value._depthScaleFactor;
                this.depthBlurFactor = value._depthBlurFactor
                this.depthOverlayFactor = value._depthOverlayFactor;
                this.depthShadowFactor = value._depthShadowFactor;
            } )
            .start();

        app.ticker.add( () => {
            amount.update();
        } );

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