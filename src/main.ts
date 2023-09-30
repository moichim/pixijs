import { Application, Container, Rectangle, Sprite } from 'pixi.js';
import { routing } from './utils/routing';
import { QuestScreen } from './screens/questScreen';
import { update } from '@tweenjs/tween.js';
import { animationManager } from './utils/animations';
import { Game } from './structure/Game';
import { GameObject } from './structure/GameObject';
import { NewScreen } from './screens/NewScreen';
import { AnotherScreen } from './screens/AnotherScreen';
import { DummyScene } from './screens/DummyScene';

/** The PixiJS app Application instance, shared across the project */
export const app = new Game<HTMLCanvasElement>({
    // resolution: Math.max(window.devicePixelRatio, 2),
    // backgroundColor: 0xd4b387,
    width: 1200,//window.innerWidth,
    height: 800, //window.innerHeight,
    hello: true,
    
});



app.ticker.add( (dt) => {
    animationManager.update();
} );

/** Setup app and initialise assets */
async function init() {

    // routing.showScreen( QuestScreen );

    // Add pixi canvas element (app.view) to the document's body
    document.getElementById( "App" )!.appendChild(app.view);

    GameObject.inject( app.manager, app.stage )

    app.manager.mountScreen( new DummyScene );

    setInterval( () => {
        app.manager.mountScreen( new DummyScene );
    }, 14000 );

    
}

// Init everything
init();

// Debugging
// https://addons.mozilla.org/en-US/firefox/addon/pixijs-devtools/
globalThis.__PIXI_APP__ = app;