import { Scene } from "../Assets/Scopes";
import { GameScreen } from "../structure/Screen/GameScreen";

export class AnotherScreen extends GameScreen {
    getAssetsDefinition(): Scene {
        return {
            background: "dummy",
            layers: [],
            borders: "normal",
            transitions: "normal",
            color: {
                primary: 0xffdd11,
                highlight: 0xffffff
            }
        };
    }
    
}