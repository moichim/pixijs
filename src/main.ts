import { Application, Container, Rectangle, Sprite } from 'pixi.js';
import { routing } from './utils/routing';
import { LoadScreen } from './screens/LoadScreen';
import { update } from '@tweenjs/tween.js';
import { animationManager } from './utils/animations';

/** The PixiJS app Application instance, shared across the project */
export const app = new Application<HTMLCanvasElement>({
    // resolution: Math.max(window.devicePixelRatio, 2),
    backgroundColor: 0x000000,
    width: window.innerWidth,
    height: window.innerHeight
});


// app.ticker.add( doTicks );

app.ticker.add( (dt) => {
    animationManager.update();
} );

/** Setup app and initialise assets */
async function init() {
    // Add pixi canvas element (app.view) to the document's body
    document.body.appendChild(app.view);

    routing.showScreen( LoadScreen );
}

// Init everything
init();
