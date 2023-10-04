import { app } from "../../main";
import { ContainerGameObject } from "../ContainerGameObject";
import { GameObject } from "../GameObject";
import { StaticTick } from "../Tick/StaticTick";
/** Do nto forget to call super methods! */
export abstract class GameScene extends GameObject {
    
    protected watch = new StaticTick<GameScene>( this, "watch" );

    public loaded = false;
    public hasSpace = false;

    public content = new ContainerGameObject();

    

    constructor() {
        super();
        this.addGameObject( this.content );
    }


    async inAlone() {
        this.hasSpace = true;
        return this.load()
            .then( () => this.show() );
    }

    async out() {
        return this.deactivate()
            .then( () => this.hide() )
            .then( () => this.destroy() );
    }

    async outTo( screen: GameScene ) {
        return this.deactivate()
            .then( () => this.hide() )
            .then( () => this.deactivate() )
            .then( () => screen.load() )
            .then( () => screen.sleep( 2000 ) )
            .then( () => screen.show() )
            .then( () => this.destroy() )
    }

    protected async onInit(): Promise<void> {

        this.position.set( app.screen.width / 2, app.screen.height / 2 );

        this.ticks.add( this.watch );

        this.watch.callback = () => {
            if ( this.hasSpace && this.loaded ) {
                this.activate();
                this.watch.stop();
                this.ticks.remove( this.watch );
            }
        };

        this.watch.start();

    }

    abstract load(): Promise<any>;

    abstract afterLoad(): Promise<void>;

    sleep(ms:number) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    protected onActivate(): void {

        // this.bundle.borders.setOpenProperties();
        // this.bundle.borders.appendImages();
    }

    protected async onDeactivate(): Promise<GameObject> {
        // this.bundle.borders.setClosedProperties();
        return this;
    }
    
}