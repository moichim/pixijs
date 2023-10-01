import { Graphics } from "pixi.js";
import { Scene } from "../Assets/Scopes";
import { app } from "../main";
import { GameScreen } from "../structure/Screen/GameScreen";
import { ScreenFactory } from "./ScreenFactory";

export class BackgroundScene extends GameScreen {

    protected graphics = new Graphics;

    getAssetsDefinition(): Scene {
        return ScreenFactory.getRandomScreen()
    }

    protected onInit(): void {

        super.onInit();

        this.graphics.beginFill( this.definition!.color.primary );
        this.graphics.drawRect( 0,0,app.screen.width,app.screen.height );
        this.graphics.pivot.set( .5 );
        this.graphics.x = app.screen.width * -1;
        this.graphics.y = app.screen.height * -1;

        this.addChild( this.graphics );

    }
    
}