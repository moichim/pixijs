import { AssetsManager } from './Bundler/AssetsManager';
import { SceneFactory } from './Bundler/SceneFactory';
import { DraftScene } from './screens/DraftScene';
import { DummyScene } from './scenes/DummyScene';
import { NormalScene } from './screens/NormalScene';
import { RandomScene } from './screens/RandomScene';
import { Game } from './structure/Game';
import { GameObject } from './structure/GameObject';
import { GameScene } from './structure/Screen/GameScene';
import { GameScreenManager } from './structure/Screen/GameScreenManager';

/** The PixiJS app Application instance, shared across the project */
export const app = new Game<HTMLCanvasElement>({
    // resolution: Math.max(window.devicePixelRatio, 2),
    // backgroundColor: 0xd4b387,
    width: 1200,//window.innerWidth,
    height: 800, //window.innerHeight,
    hello: true,
    backgroundAlpha: 0
    
});

export const assets = new AssetsManager();

/** Setup app and initialise assets */
async function init() {

    // routing.showScreen( QuestScreen );

    // Add pixi canvas element (app.view) to the document's body
    document.getElementById( "App" )!.appendChild(app.view);

    const scene = new DummyScene("dummy");

    scene.factory.addLayer( 0, "layer_2" );
    scene.factory.addLayer( 1, "layer_3", "normal", {y:300} );

    app.manager.mountScreen( scene );

    GameObject.inject( app.manager, app.stage );

    console.log( scene );

    /*

    GameObject.inject( app.manager, app.stage )

    app.manager.mountScreen( RandomScene.getValleySceene() );

    app.manager.on( "mousedown", () => {
        app.manager.mountScreen( RandomScene.getValleySceene() )
    } )

    window.addEventListener( "keydown", event => {
        if ( event.key === "r" ) {
            app.manager.mountScreen( RandomScene.getValleySceene() );
        } else if ( event.key === "q" ) {
            app.manager.mountScreen( DummyScene.getValleySceene() )
        }
        else if ( event.key === "w" ) {
            app.manager.mountScreen( NormalScene.getValleySceene() )
        }
        else if ( event.key === "e" ) {
            app.manager.mountScreen( DraftScene.getValleySceene() )
        }
    } );
    )
    */

    
}


// Init everything
init();

// Debugging
// https://addons.mozilla.org/en-US/firefox/addon/pixijs-devtools/

// @ts-ignore
globalThis.__PIXI_APP__ = app;