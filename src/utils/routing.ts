import * as PIXI from "pixi.js";
import { app } from "../main";
import { areBundlesLoaded, loadBundles } from "./assets";
import { pool } from "./pool";

export interface AppScreen extends PIXI.Container {

    container: PIXI.Container;

    show?(): Promise<void>;

    hide?(): Promise<void>;

    pause?(): Promise<void>;

    resume?(): Promise<void>;

    prepare?(): Promise<void>;

    reset?(): Promise<void>;

    update?( delta: number ): void;

    resize?( width: number, height: number ): void;

    blur?(): void;

    focus?(): void;

}

export interface AppScreenConstructor {

    new (): AppScreen;

    assetBundles?: string[];

}


class Routing {

    public container = new PIXI.Container();

    public width = 0;
    public height = 0;

    public background?: AppScreen;
    public current?: AppScreen;
    public popup?: AppScreen;

    public setBackground( bgConstructor: AppScreenConstructor ) {
        this.background = new bgConstructor();
        this.addAndShowScreen( this.background );
    }

    private async addAndShowScreen( screen: AppScreen ) {

        if ( !this.container.parent ) {
            app.stage.addChild( this.container );
        }

        this.container.addChild( screen );

        if ( screen.prepare ) 
            screen.prepare();
        
        if ( screen.resize ) 
            screen.resize( this.width, this.height );

        if ( screen.update )
            app.ticker.add( screen.update, screen );

        if ( screen.show ) {
            screen.interactiveChildren = false;
            await screen.show();
            screen.interactiveChildren = true;
        }

    }

    private async hideAndRemoveScreen( screen: AppScreen ) {
        screen.interactiveChildren = false;

        if ( screen.hide ) screen.hide();

        if ( screen.update ) app.ticker.remove( screen.update, screen );

        if ( screen.parent ) screen.parent.removeChild( screen );

        if ( screen.reset ) screen.reset();
    }

    public async showScreen( ctor: AppScreenConstructor ) {
        
        if ( this.current )
            this.current.interactiveChildren = false;
        
        if ( ctor.assetBundles && !areBundlesLoaded( ctor.assetBundles ) ) {
            await loadBundles( ctor.assetBundles );
        }
        if ( this.current ) {
            await this.hideAndRemoveScreen( this.current );
        }

        this.current = pool.get( ctor );
        this.addAndShowScreen( this.current );
    }

}

export const routing = new Routing();