import { BlurFilter, Container, Sprite } from "pixi.js";
import { Colors, Layer } from "../../Assets/Scopes";
import { ParallaxScene } from "../../screens/ParallaxScene";
import { ContainerGameObject } from "../ContainerGameObject";
import { GameObject } from "../GameObject";
import { XYVal } from "../../utils/XYVal";
import { app } from "../../main";
import { LayerAssets } from "../../Assets/LayerAssets";
import { ColorOverlayFilter } from "pixi-filters";
import { TweenTick } from "../Tick/TweenTick";

export class ParallaxLayer extends GameObject {

    declare parent: ParallaxScene;

    // Inner structure

    public panner = ContainerGameObject.atCenter();
    public positioner = ContainerGameObject.atCenter();
    public content = ContainerGameObject.atCenter();
    public land = ContainerGameObject.atCenter();

    // Filters

    public blur = new BlurFilter( 0, 2 );
    public overlay = new ColorOverlayFilter();

    // Handles

    public dimension = new XYVal();
    public pan = new XYVal();
    public pos = new XYVal();

    // Inherited properties
    // ...are below

    // Tweens
    public tween: TweenTick = new TweenTick( this, "state" );
    

    constructor(
        protected readonly index: number,
        protected readonly depth: number,
        protected readonly definition: LayerAssets,
        protected readonly color: Colors,
        protected readonly verticalShift: number = 0,
        protected readonly hasMirrors: boolean = true
    ) {
        super();

        // Set center
        this.x = app.screen.width / -2;
        this.y = ( app.screen.height / -2 ) + verticalShift;

        // Bind inner structure
        this.addGameObject( this.panner );
        this.panner.addGameObject( this.positioner );
        this.positioner.addGameObject( this.content );
        this.content.addGameObject( this.land );

        // Init filters
        this.filters = [
            this.overlay,
            this.blur
        ];

    }

    protected onMount(): void {
        
        // Add listeners to parent properties

        this.pan.onX = value => this.panner.x = value * this.parent.perspective.x;
        this.pan.onY = value => this.panner.y = value * this.parent.perspective.y;

        this.pos.onX = value => this.positioner.x = value;
        this.pos.onY = value => this.positioner.y = value;

        // Inherit from parent

        this.inheritDepth( this.parent.depthScaleFactor );
        
        this.inheritBlur( this.parent.depthBlurFactor );

        this.overlay.color = this.color.primary;
        this.inheritTint( this.parent.depthOverlayFactor );

        this.ticks.add( this.tween );

        console.log( this );

    }


    public async onShow() {
        super.onShow && super.onShow();

            const land = this.definition.getRandomLand().texture;

            console.log( land );

            const center = new Sprite( land );
            center.pivot.set( .5 );
            center.anchor.set( .5 );
            this.land.addChild( center );

            if ( this.hasMirrors === true ) {

                const left = new Sprite( land );
                left.pivot.set( .5 );
                left.anchor.set( .5 );
                left.scale.x = -1;
                left.position.x = - app.screen.width * 2 + 100;
                this.land.addChild( left );

                const right = new Sprite( land );
                right.pivot.set( .5 );
                right.anchor.set( .5 );
                right.scale.x = -1;
                right.position.x = app.screen.width * 2 - 100;
                this.land.addChild( right );

            }

        return this;
    }



    // Animable properties
    public inheritDepth( value: number ) {
        this.scale.set( this.getNegativeAspect( value, 0 ) );
    }

    public inheritBlur( value: number ) {
        this.blur.blur = value * this.depth;
    }

    public inheritTint( value: number ) {
        this.overlay.alpha = value * this.depth;
    }






    ///// OLD AND UGLY

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

}