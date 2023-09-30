import { Graphics } from "pixi.js";
import { Scene } from "../Assets/Scopes";
import { GameScreen } from "../structure/Screen/GameScreen";
import { AbstractScreen } from "../utils/routing";
import { ScreenFactory } from "./ScreenFactory";
import { app } from "../main";

export class DummyScene extends GameScreen {

    protected graphics = new Graphics;

    getAssetsDefinition(): Scene {
        return ScreenFactory.getRandomScreen()
    }

    protected onInit(): void {
        super.onInit();

        this.graphics.beginFill( this.definition!.color.primary );
        this.graphics.drawRect( 0,0,app.screen.width,app.screen.height );
        this.graphics.pivot.set( .5 );
        this.graphics.x = app.screen.width / -2;
        this.graphics.y = app.screen.height / -2;

        this.addChild( this.graphics );

        console.log( this.definition );
    }
    
}