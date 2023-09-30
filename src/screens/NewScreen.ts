import { Scene } from "../Assets/Scopes";
import { GameScreen } from "../structure/Screen/GameScreen";

export class NewScreen extends GameScreen {

    getAssetsDefinition(): Scene {
        return {
            background: "dummy",
            layers: [],
            borders: "dummy",
            transitions: "dummy",
            color: {
                primary: 0xffdd11,
                highlight: 0xffffff
            }
        };
    }
    
}