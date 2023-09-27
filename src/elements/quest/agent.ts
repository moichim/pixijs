import { Tween } from "@tweenjs/tween.js";
import { Container, Graphics, Polygon, Rectangle, Resource, Sprite, Texture } from "pixi.js";
import { app } from "../../main";
import { QuestParallax } from "./questParallax";

import polygons from "../../../raw-assets/bird.json";
import HitAreaShapes from "../../utils/hitAreaShapes";
import { OutlineFilter } from "pixi-filters";

const hitAreaShapes = new HitAreaShapes( polygons );

export class Agent extends Container {

    declare parent: QuestParallax;

    graphics = new Container();
    sprite!: Sprite;

    tween!: Tween<Agent>;
    tweening: boolean = true;

    outline = new OutlineFilter(0);
    outlineTween!: Tween<OutlineFilter>;

    constructor(
        public readonly number: number,
        public readonly image: Texture<Resource>
    ) {
        super();
    }

    mount() {

        this.filters = [
            this.outline
        ];

        this.pivot.set( .5 );
        this.graphics.pivot.set( .5 );

        this.sprite = new Sprite( this.image );

        // Set position of the image
        this.sprite.x = this.image.width / -2;
        this.sprite.y = this.image.height / -2;

        this.graphics.addChild( this.sprite );
        this.addChild( this.graphics );

        this.tween = new Tween( this );
        this.outlineTween = new Tween( this.outline );
        this.outline.color = 0xff00ff;

        this.sprite.hitArea = hitAreaShapes;

        this.sprite.cursor = "pointer";

        this.sprite.interactive = true;
        this.sprite.on( "mousedown", (event) => {
            this.stopAnimations();
            this.tweening = !this.tweening;

        } )

        this.sprite.on( "mouseenter", (event) => {
            this.highlight();
            // this.tweening = !this.tweening;

        } )

        this.sprite.on( "mouseleave", (event) => {
            this.highought();
            // this.tweening = !this.tweening;

        } )

    }

    highlight() {
        this.outline.thickness = 10;
    }

    highought() {
        this.outline.thickness = 0;
    }

    public unmount() {

        this.out();

    }


    public start() {

        this.in();
        app.ticker.add( () => this.update() );

    }

    public stopAnimations() {
        this.tweening = false;
        this.tween.stop();
    }

    public pauseAnimations() {
        this.tweening = false;
        this.tween.pause();
    }

    public resumeAnimations() 
    {
        this.tweening = true;
        this.tween.resume();
    }

    public update() {
        if ( this.tweening )
            this.tween.update();
        this.outlineTween.update();
    }

    // Animations
    protected in() {
        this.tween.to( {
            graphics: {
                y: -300
            }
        }, 500 )
            .onComplete( () => this.live() )
            .start();
    }

    protected out() {

        this.tween.to( {
            graphics: {
                y: 300
            }
        }, 500 )
            .start()
            .onComplete( () => {
                this.parent.removeChild( this );
            } );
    }

    protected getAspect() {
        return ( Math.random() * 2 ) - 1;
    }

    protected shouldAddTweenProperty() {
        return Math.random() > .5;
    }

    protected generateRandomTween() {

        if ( ! this.tweening )
            return;

        const delay = Math.abs( Math.random() * 1000 );
        const duration = Math.abs( Math.random() * 3000 ) + 1000;
        const properties: any = {};

        if ( this.shouldAddTweenProperty() ) {
            properties.x = this.getAspect() * 50;
        }

        if ( this.shouldAddTweenProperty() ) {
            properties.y = this.getAspect() * 10;
        }

        if ( this.shouldAddTweenProperty() ) {
            const s = ( Math.random() * .2 ) + .9;
            properties.scale = {};
            properties.scale.x = s;
            properties.scale.y = s;
        }

        if ( this.shouldAddTweenProperty() ) {
            properties.rotation = this.getAspect() * .1;
        }

        this.tween.stop();

        this.tween.to( properties, duration )
            .delay( delay )
            .start()
            .onComplete( () => this.generateRandomTween() )

    }

    protected live() {
        this.generateRandomTween();
    }


}