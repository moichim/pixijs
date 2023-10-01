import { app } from "../../main";
import { GameObject } from "../GameObject";
import { GameScreen } from "./GameScreen";

export class GameScreenManager extends GameObject {
    

    protected currentScreen?: GameScreen;
    protected pendingScreen?: GameScreen;

    // All children should ever go here
    declare children: GameScreen[];

    constructor(  ) {
        super();
        this.pivot.set(.5);
    }

    protected async onShow() {
        this.position.x = app.screen.width / 2;
        this.position.y = app.screen.height / 2;
        return this;
    }

    /** Screens are mounted invisible as soon as their assets are loaded, they are triggered */
    mountScreen( screen: GameScreen ) {

        
        app.manager.interactive = false;
        app.manager.interactiveChildren = false;


        this.currentScreen = this.pendingScreen;
        this.pendingScreen = this.addGameObject( screen, false, false );

        if ( this.currentScreen )
            return this.currentScreen.outTo( this.pendingScreen ).then( () => {

                this.pendingScreen!.hasSpace = true;

                app.manager.interactive = true;
                app.manager.interactiveChildren = true;

                return;

            } );
        else 
            return this.pendingScreen.inAlone();
        
    }
}