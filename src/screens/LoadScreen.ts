import { Container, DisplayObject, Graphics } from "pixi.js";
import { Parallaxes } from '../elements/parallax/parallaxes';
import { AppScreen } from "../utils/routing";

export class LoadScreen extends Container implements AppScreen {



    public static assetBundles = ['preload'];
    container: Container<DisplayObject> = new Container;

    public graphics = new Graphics();

    public size: number = 1;
    public time: number = 0;

    constructor() {
        super();

        const parallaxes = new Parallaxes;

        this.addChild( parallaxes );
    }

    async show(): Promise<void> {

        this.graphics.beginFill(0xff000cc);
        this.graphics.drawCircle(100, 100, 30);
        this.graphics.beginFill( 0x00ff00 );
        this.graphics.drawCircle(150, 150, 30);
        this.graphics.pivot.set( .5 );

        // shakeAnimation( this.graphics.position );

    }
}