import { Tween } from "@tweenjs/tween.js";
import { BevelFilter, GlowFilter, OldFilmFilter, PixelateFilter, RGBSplitFilter, ReflectionFilter, ShockwaveFilter, ZoomBlurFilter } from "pixi-filters";
import { NoiseFilter, Resource, Texture } from "pixi.js";
import { Parallaxes } from '../elements/parallax/parallaxes';
import { SpriteParallax } from "../elements/parallax/parallaxes/spriteParallax";
import { AbstractScreen } from "../utils/routing";
import { QuestParallax } from "../elements/quest/questParallax";
import { app } from "../main";

export class QuestScreen extends AbstractScreen {

    declare assets: {
        // mask: Texture<Resource>,
        a: Texture<Resource>,
        b: Texture<Resource>,
        c: Texture<Resource>,
        bg: Texture<Resource>,
        bird: Texture<Resource>
    }

    public tween!: Tween<Parallaxes>;

    protected async onInit() {
        
        const assets = await this.loadAssets( "smrt", {
            a: "raw-assets/paper_1.png",
            b: "raw-assets/paper_2.png",
            c: "raw-assets/paper_3.png",
            bg: "raw-assets/bg.jpg",
            bird: "raw-assets/bird.png"
        } );

        return;

    }

    async show(): Promise<void> {

        const parallaxes = new Parallaxes();

        // Add images first

        parallaxes.addParallax( new SpriteParallax( this.assets.c ), {
            color: 0xff0000,
            depth: 5,
            y: -500
        } );

        parallaxes.addParallax( new SpriteParallax( this.assets.a ), {
            color: 0xff0000,
            depth: 3,
            y: -300
        } );

        parallaxes.addParallax( new SpriteParallax( this.assets.b ), {
            color: 0xff0000,
            depth: 2,
            y: -100
        } );

        const q = new QuestParallax( this.assets.b, [ -200, -100, 100, 0 ], this.assets );

        const r = new QuestParallax( this.assets.b, [ -200, -100, 100, 0 ], this.assets );

        parallaxes.addParallax( r, {
            depth: 1,
            y: 100
        } );

        parallaxes.addParallax( q, {
            depth: 0,
            y: 200
        } );

        q.addNumber( 7 );

        r.addNumber( 3 );

        r.addNumber( 4 );

        

        /*
        const vignette = new OldFilmFilter({
            noise: 0.7,
            noiseSize: 2,
            sepia: 1,
            scratch: 0.5,
            vignetting: 0.3,
            vignettingAlpha: .5
        });

        parallaxes.filters = [
            vignette
        ];

        */

        this.filters = [];

        this.filters.push(
            // new RGBSplitFilter
        );

        //this.filters.push( new PixelateFilter(5));
    

        // Then setup the parallax

        parallaxes.setBgColor( 0xf5b342 );
        parallaxes.parallaxes.map( item => item.startTween() );

        // Then setup the animation
        this.tween = new Tween<Parallaxes>( parallaxes )

            .to( {
                depthBlurFactor: 1,
                depthScaleFactor: 0.1,
                depthOverlayFactor: .1,
                pan: {
                    y: 10
                }
            }, 2000 )
            .start( );
        

        this.addChild( parallaxes );


        this.interactive = true;
        this.on( "mousemove", event => {

            const calcAspect = ( value: number, side: number ) => {
                const center = side / 2;
                return ( center - value ) / center;
            }

            parallaxes.pan.x = calcAspect( event.x, app.screen.width );

            parallaxes.pan.y = calcAspect( event.y, app.screen.height ) + 10;

        } )

    }

    update() {
        // console.log( this );
        this.tween.update()
    }
}