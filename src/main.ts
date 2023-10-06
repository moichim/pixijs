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

    // Add pixi canvas element (app.view) to the document's body
    document.getElementById( "App" )!.appendChild(app.view);

    const scene = new DummyScene("dummy");

    scene.factory.addLayer( 0, "layer_1" );
    scene.factory.addLayer( 1, "layer_2" );
    const s3 = scene.factory.addLayer( 2, "layer_3" );
    scene.factory.addLayer( 3, "layer_4" );
    scene.factory.addLayer( 4, "layer_5" );

    scene.depthScaleFactor = 0.1;
    scene.depthBlurFactor = 0.5;
    scene.depthOverlayFactor = 0.01;
    scene.perspective.x = 100;
    scene.perspective.y = 100;
    scene.factory.colors.primary = 0x00ffff;

    console.log( scene.factory );

    setTimeout(  () => {
        scene.addAgent();
        scene.addAgent();
        scene.addAgent();
    }, 1000 );
    

    app.manager.mountScreen( scene );

    GameObject.inject( app.manager, app.stage );
    
}


// Init everything
init();

// Debugging
// https://addons.mozilla.org/en-US/firefox/addon/pixijs-devtools/

// @ts-ignore
globalThis.__PIXI_APP__ = app;