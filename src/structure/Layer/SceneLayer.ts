import { ColorOverlayFilter } from "pixi-filters";
import { BlurFilter, Sprite } from "pixi.js";
import { LayerDefinition } from "../Screen/SceneFactory";
import { app } from "../../main";
import { ParallaxScene } from "../../scenes/ParallaxScene";
import { XYVal } from "../../utils/XYVal";
import { ContainerGameObject } from "../ContainerGameObject";
import { GameObject } from "../GameObject";
import { TweenTick } from "../Tick/TweenTick";

export class SceneLayer extends GameObject {

    declare parent: ParallaxScene;

    public depth: number;

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
        protected readonly definition: ReturnType<LayerDefinition["getResult"]>,
        // protected readonly color: Colors
    ) {
        super();

        this.depth = this.definition.depth;

        // Set center
        this.x = app.screen.width / -2;
        this.y = ( app.screen.height / -2 );

        // Bind inner structure
        this.addGameObject( this.panner );
        this.panner.addGameObject( this.positioner );
        this.positioner.addGameObject( this.content );
        this.content.addGameObject( this.land );

        // Implement shift
        if ( this.definition.shift ) {
            if ( this.definition.shift.x )
                this.positioner.x = this.definition.shift.x;
            if ( this.definition.shift.y )
                this.positioner.y = this.definition.shift.y;
        }

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

        this.overlay.color = this.parent.factory.colors.primary;
        this.inheritTint( this.parent.depthOverlayFactor );

        this.ticks.add( this.tween );

    }


    public async onShow() {
        super.onShow && super.onShow();

        console.log( this.definition.land );

            const l = new Sprite( this.definition.land!.texture! );

            l.pivot.set( .5 );
            l.anchor.set( .5 );

            this.land.addChild( l );

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