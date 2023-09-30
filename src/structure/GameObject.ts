import { Container } from "pixi.js";
import { TweenManager } from "./Tick/TickManager";


/**
 * Lifecycle of a game object:
 * 1. `constructor` create constructor-safe objects
 * 2. `init` create non-constructor-safe objects
 * 3. binding to parent
 * 4. `mount` append to parent & inherit its props
 * 5. `show` display on the screen
 * 6. `activate` start ticks & other logic
 * 
 * To be sure the lifecicle is correct, only manage GameObjects using:
 * - `GameObject.inject` to add it to a `PIXI.Container`
 * - `addGameObject` to add it to another `GameObject`
 */
export abstract class GameObject extends Container {

    public readonly _a: string = this.constructor.name;

    public _showTimeout?: NodeJS.Timeout;

    public readonly ticks: TweenManager = new TweenManager( this );

    public readonly uuid = crypto.randomUUID();

    constructor() {
        super();
        this.pivot.set( .5 );
    }

    public static inject<T extends GameObject>(
        object: T,
        target: Container,
        showImmediately: boolean = true,
        startImmediately: boolean = true
    ): T {

        object.visible = false;
        object.init();
        target.addChild( object );
        object.mount();
        if ( showImmediately === true ) {
            object.show();
            if ( startImmediately === true )
                object.ticks.startAll();
        }

        return object;
    }

    

    public addGameObject<T extends GameObject>(
        object: T,
        /** Provide a number */
        showImmediately: boolean = true,
        startImmediately: boolean = true
    ): T {
        object.visible = false;
        object.init();
        this.addChild( object );
        object.mount();
        if ( showImmediately === true ) {
            object.show();
            if ( startImmediately === true )
                object.activate();
        }

        return object;
    }

    /** 
     * Called right after the constructor, before appending to the parent.
     * - parent props are inaccessible
     * - initialises all ticks
    */
    protected init() {
        this.onInit && this.onInit();
    };
    protected onInit?(): void;



    /**
     * Called after the object is binded to its parent.
     * - object is still invisible until `show()` is called
     */
    protected mount() {
        this.onMount && this.onMount();
    };
    protected onMount?(): void;



    /**
     * Must be called after initialisation and mounting.
     * - shows the object
     */
    public async show() {
        this.visible = true;
        if ( this.onShow ) {
            return this.onShow();
        }
        return this;
    };
    protected async onShow?(): Promise<GameObject>;


    public activate() {
        this.ticks.startAll();
        this.onActivate && this.onActivate();
    }
    protected onActivate?(): void;

    public async deactivate() {
        this.ticks.stopAll();
        if ( this.onDeactivate ) 
            return this.onDeactivate();
        return this;
    }
    protected async onDeactivate?(): Promise<GameObject>;

    public async hide() {
        if ( this.onHide )
            return this.onHide();
        return this;
    };
    protected async onHide?(): Promise<GameObject>;



    /** Immediately destroys the entire GameObject and all its components. */
    public destroy() {

        if ( this._showTimeout )
            clearTimeout( this._showTimeout );


        if ( this.onDestroy ) 
            this.onDestroy();
        
        this.ticks.stopAll();
        this.ticks.destroy();

        this.parent?.removeChild( this );

    }
    protected onDestroy?(): void;



    

}