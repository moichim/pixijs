import { Tween } from "@tweenjs/tween.js";
import { OldFilmFilter } from "pixi-filters";
import { Resource, Texture } from "pixi.js";
import { Parallaxes } from '../elements/parallax/parallaxes';
import { SpriteParallax } from "../elements/parallax/parallaxes/spriteParallax";
import { AbstractScreen } from "../utils/routing";

export class QuestScreen extends AbstractScreen {

    declare assets: {
        // mask: Texture<Resource>,
        a: Texture<Resource>,
        b: Texture<Resource>,
        c: Texture<Resource>,
        bg: Texture<Resource>
    }

    public tween!: Tween<Parallaxes>;

    protected async onInit() {
        
        const assets = await this.loadAssets( "smrt", {
            a: "raw-assets/paper_1.png",
            b: "raw-assets/paper_2.png",
            c: "raw-assets/paper_3.png",
            bg: "raw-assets/bg.jpg",
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

        parallaxes.addParallax( new SpriteParallax( this.assets.a ), {
            color: 0xff0000,
            depth: 0,
            y: 0
        } );



        parallaxes.addParallax( new SpriteParallax( this.assets.b ), {
            color: 0xff0000,
            depth: -3,
            y: 150
        } );

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
    

        // Then setup the parallax

        parallaxes.setBgColor( 0xf5b342 );
        parallaxes.parallaxes.map( item => item.startTween() );

        // Then setup the animation
        this.tween = new Tween<Parallaxes>( parallaxes )

            .to( {
                depthBlurFactor: 2,
                depthScaleFactor: 0.05,
                depthOverlayFactor: .07,
                pan: {
                    y: 10
                }
            }, 2000 )
            // .delay( 500 )
            .onComplete( result => {
                console.log( "starting", parallaxes.children );
                // parallaxes.parallaxes.map( item => item.startTween() );
            } )
            .start( );
        

        this.addChild( parallaxes );

    }

    update() {
        // console.log( this );
        this.tween.update()
    }
}