import { LayerAssets } from "../Assets/LayerAssets";
import { Colors } from "../Assets/Scopes";
import { app } from "../main";
import { GameObject } from "../structure/GameObject";
import { ParallaxLayer } from "../structure/Layer/ParallaxLayer";
import { GameScreenManager } from "../structure/Screen/GameScreenManager";
import { XYVal } from "../utils/XYVal";
import { BackgroundScene } from "./BackgroundScene";

export class ParallaxScene extends BackgroundScene {

    declare parent: GameScreenManager;
    declare children: ParallaxLayer[];

    protected layers: ParallaxLayer[] = [];

    // Handles

    public pan: XYVal = new XYVal( 0, 0 );
    public perspective = new XYVal( 40, 30 );


    constructor() {
        super();

        this.pivot.set( .5 );

        // Add listeners to pan handlers
        // == project the actual value downwards

        this.pan.onX = value => this.layers.map( item => item.pan.x = value );
        this.pan.onY = value => this.layers.map( item => item.pan.y = value );

        
            

    }



    // Create test instance

    public static getValleySceene() {

        const item = new ParallaxScene;

        const scene = item.getStoredAssetsDefinition();

        item.addLayer( 0, 5, item.assets.layers[4], scene.color, -170, true );

        item.addLayer( 1, 3.5, item.assets.layers[3], scene.color, -40, false );

        item.addLayer( 2, 2, item.assets.layers[2], scene.color, -20, false );

        item.addLayer( 3, 0, item.assets.layers[1], scene.color, -100, false );

        item.addLayer( 4, -1.5, item.assets.layers[0], scene.color, -280, false );

        return item;

    }

    public static getPlainScene() {

        const item = new ParallaxScene;

        const scene = item.getStoredAssetsDefinition();

        item.addLayer( 0, 5, item.assets.layers[4], scene.color, -120, true );

        item.addLayer( 1, 3.5, item.assets.layers[3], scene.color, -30, false );

        item.addLayer( 2, 2, item.assets.layers[2], scene.color, -10, false );

        item.addLayer( 3, 0, item.assets.layers[1], scene.color, -70, false );

        item.addLayer( 4, -1.5, item.assets.layers[0], scene.color, -220, false );

        return item;

    }

    public addLayer(
        index: number,
        depth: number,
        definition: LayerAssets,
        colors: Colors,
        verticalShift: number,
        hasMirrors: boolean
    ) {

        const layer = new ParallaxLayer( index, depth, definition, colors, verticalShift, hasMirrors );
        this.layers.push( layer );
        return layer;
    }

    protected onInit() {

        super.onInit();

        this.layers.forEach( layer => this.addGameObject( layer, false, false ) );

        this.interactive = true;

        this.on( "mousemove", event => {

            const wHalf = app.screen.width / 2;
            this.pan.x = ( event.global.x - wHalf ) / wHalf;

            const hHalf = app.screen.height / 2;
            this.pan.y = ( event.global.y - hHalf ) / hHalf;

        } )

    }

    public onLoad() {
        this.layers.forEach( layer => layer.show() );
    }

    protected async onShow(): Promise<GameObject> {

        // Debugovací
        this.layers.forEach( ( layer, index ) => {

            const amount = this.layers.length - index;

            const by = ( 200 * index ) + -400;

            layer.pos.y = by;

            // layer.pos.x = ( ( Math.random() * 2 ) - 1 ) * 500;
            // layer.pos.y = ( ( Math.random() * 2 ) - 1 ) * 500;
        } );
        

        return this;
    }

    

    /** What is the difference between depth 0 and depth 1? */
    public _depthScaleFactor: number = 0.15;
    public get depthScaleFactor() { return this._depthScaleFactor; }
    public set depthScaleFactor( value: number ) {
        this._depthScaleFactor = value;
        this.layers.map( item => item.inheritDepth( value ) );
    }

    /** What is the difference between depth 0 and depth 1? */
    public _depthBlurFactor: number = 1;
    public get depthBlurFactor() { return this._depthBlurFactor; }
    public set depthBlurFactor( value: number ) {
        this._depthScaleFactor = value;
        this.layers.map( item => item.inheritBlur( value ) );
    }

     /** What is the difference between depth 0 and depth 1? */
     public _depthOverlayFactor: number = 0;
     public get depthOverlayFactor() { return this._depthScaleFactor; }
     public set depthOverlayFactor( value: number ) {
         this._depthOverlayFactor = value;
         // this.parallaxes.map( item => item.applyParentOverlay( value ) );
     }



}