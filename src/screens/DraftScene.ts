import { Scene } from "../Assets/Scopes";
import { ParallaxScene } from "./ParallaxScene";
import { ScreenFactory } from "./ScreenFactory";

export class DraftScene extends ParallaxScene {

    public getAssetsDefinition(): Scene {
        return ScreenFactory.getMonoScene( "draft" );
    }

}