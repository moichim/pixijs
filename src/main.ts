import { AssetsManager } from './assets/AssetsManager';
import { DummyScene } from './scenes/DummyScene';
import { Game } from './structure/Game';
import { GameObject } from './structure/GameObject';

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

    // console.log( getBundleFilesManifest( Bundles.dummy ) );

    // Add pixi canvas element (app.view) to the document's body
    document.getElementById( "App" )!.appendChild(app.view);

    const scene = new DummyScene("dummy");

    scene.factory.addLayer( 0, "layer_2" );
    scene.factory.addLayer( 3, "layer_3", "normal", {x:-300, y: -100} );

    app.manager.mountScreen( scene );

    GameObject.inject( app.manager, app.stage );
    
}


// Init everything
init();

// Debugging
// https://addons.mozilla.org/en-US/firefox/addon/pixijs-devtools/

// @ts-ignore
globalThis.__PIXI_APP__ = app;