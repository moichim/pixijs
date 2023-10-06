import { DisplayObject, Sprite } from "pixi.js";
import { BundledFile } from "../../assets/AssetsManager";
import { GameObject } from "../GameObject";
import { Tween } from "@tweenjs/tween.js";
import { TweenTick } from "../Tick/TweenTick";
import { OutlineFilter } from "pixi-filters";
import { Spot } from "./Spot";

export class Agent extends GameObject {

    declare parent: Spot;

    protected sprite: Sprite;

    protected spriteTweener!: TweenTick;
    protected filterTweener!: TweenTick;

    public outline = new OutlineFilter();

    constructor( 
        public readonly file: BundledFile,
        public readonly colors: any
    ) {
        super();

        this.sprite = new Sprite( this.file.texture! );
        this.outline.thickness = 0;

        this.filters = [ this.outline ];

    }

    protected onInit(): void {

        // Setup the filter
        this.outline.color = this.colors.primary;

        // Setup the sprite
        
        this.sprite.pivot.set( .5 );
        this.sprite.anchor.set( .5, 1 );
        this.sprite.y = 300;

        this.sprite.interactive = true;

        this.sprite.on( "mouseenter", () => {
            this.sprite.cursor = "pointer";
            this.filterTweener.to( {
                outline: {
                    thickness: 10
                }
            }, 300 )
            .start();
        } );

        this.sprite.on( "mouseleave", () => {
            this.filterTweener.to( {
                outline: {
                    thickness: 0
                }
            }, 300 )
            .start();
        } );

        this.sprite.on( "mousedown", () => {
            this.filterTweener.to( {
                position: {
                    x: 0,
                    y: 100
                },
                alpha: 0
            }, 300 )
            .onComplete( this.hide.bind(this) )
            .start();
        } );
        

        this.addChild( this.sprite );


        // Setup the tweener
        this.spriteTweener = new TweenTick( this.sprite, "tweener" );

         this.ticks.add( this.spriteTweener );

        this.spriteTweener
            .to( {y:0}, 200 )
            // .onUpdate(console.log)
            .start();

        // Setup the tweener
        this.filterTweener = new TweenTick( this, "outline" );

         this.ticks.add( this.filterTweener );

    }

    protected async onHide(): Promise<GameObject> {
        this.destroy();
        this.parent.setFree( true );
        return this;
    }

}