import { LayerAssets } from "../Assets/LayerAssets";
import { Colors } from "../Assets/Scopes";
import { SceneFactory } from "../Bundler/SceneFactory";
import { app } from "../main";
import { ParallaxLayer } from "../structure/Layer/ParallaxLayer";
import { SceneLayer } from "../structure/Layer/SceneLayer";
import { GameScene } from "../structure/Screen/GameScene";
import { GameScreenManager } from "../structure/Screen/GameScreenManager";
import { XYVal } from "../utils/XYVal";

export class ParallaxScene extends GameScene {

    declare parent: GameScreenManager;

    layerLinks: SceneLayer[] = [];

    // Handles

    public pan: XYVal = new XYVal( 0, 0 );
    public perspective = new XYVal( 40, 30 );

    public factory: SceneFactory;


    constructor(
        public readonly defaultBundle: string
    ) {
        super();

        this.factory = new SceneFactory( this.defaultBundle );

        this.pivot.set( .5 );

        // Add listeners to pan handlers
        // == project the actual value downwards

        this.pan.onX = value => this.layerLinks.map( item => item.pan.x = value );
        this.pan.onY = value => this.layerLinks.map( item => item.pan.y = value );

        
            

    }


    protected async onInit() {

        super.onInit();

        this.layerLinks.forEach( layer => this.addGameObject( layer, false, false ) );

        this.interactive = true;

        this.on( "mousemove", event => {

            const wHalf = app.screen.width / 2;
            this.pan.x = ( event.global.x - wHalf ) / wHalf;

            const hHalf = app.screen.height / 2;
            this.pan.y = ( event.global.y - hHalf ) / hHalf;

        } )

    }

    public async load() {
        return this.factory.load().then( () => {
            this.loaded = true;
            this.afterLoad();
        });
    }

    public async afterLoad() {


        // Add layers
        this.factory.getResult().layers.forEach( layer => {
            console.log( layer );

            const l = new SceneLayer( layer );
            this.layerLinks.push( l );
            this.addGameObject( l );
        } )

        // console.log( this.factory.getResult() );
        // this.layerLinks.forEach( layer => layer.show() );
    }

    

    /** What is the difference between depth 0 and depth 1? */
    public _depthScaleFactor: number = 0.15;
    public get depthScaleFactor() { return this._depthScaleFactor; }
    public set depthScaleFactor( value: number ) {
        this._depthScaleFactor = value;
        this.layerLinks.map( item => item.inheritDepth( value ) );
    }

    /** What is the difference between depth 0 and depth 1? */
    public _depthBlurFactor: number = 1;
    public get depthBlurFactor() { return this._depthBlurFactor; }
    public set depthBlurFactor( value: number ) {
        this._depthScaleFactor = value;
        this.layerLinks.map( item => item.inheritBlur( value ) );
    }

     /** What is the difference between depth 0 and depth 1? */
     public _depthOverlayFactor: number = 0;
     public get depthOverlayFactor() { return this._depthScaleFactor; }
     public set depthOverlayFactor( value: number ) {
         this._depthOverlayFactor = value;
         // this.parallaxes.map( item => item.applyParentOverlay( value ) );
     }



}