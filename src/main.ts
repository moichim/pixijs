import { Application, Container, Rectangle, Sprite } from 'pixi.js';
import { routing } from './utils/routing';
import { QuestScreen } from './screens/questScreen';
import { update } from '@tweenjs/tween.js';
import { animationManager } from './utils/animations';

/** The PixiJS app Application instance, shared across the project */
export const app = new Application<HTMLCanvasElement>({
    // resolution: Math.max(window.devicePixelRatio, 2),
    backgroundColor: 0xd4b387,
    width: 1000,//window.innerWidth,
    height: 800, //window.innerHeight,
    // backgroundAlpha: 0
});



app.ticker.add( (dt) => {
    animationManager.update();
} );

/** Setup app and initialise assets */
async function init() {

    // Add pixi canvas element (app.view) to the document's body
    document.body.appendChild(app.view);

    routing.showScreen( QuestScreen );
}

// Init everything
init();

// Debugging
// https://addons.mozilla.org/en-US/firefox/addon/pixijs-devtools/
globalThis.__PIXI_APP__ = app;