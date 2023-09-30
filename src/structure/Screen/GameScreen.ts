import { Bundle } from "../../Assets/Bundle";
import { Scene } from "../../Assets/Scopes";
import { GameObject } from "../GameObject";
import { StaticTick } from "../Tick/StaticTick";
/** Do nto forget to call super methods! */
export abstract class GameScreen extends GameObject {
    
    protected watch = new StaticTick<GameScreen>( this, "watch" );

    public loaded = false;
    public hasSpace = false;

    protected readonly bundle: Bundle;

    protected definition?: Scene;

    constructor() {
        super();
        this.bundle = new Bundle( this.getAssets(), this );
    }

    /** Define the scene assets */
    abstract getAssetsDefinition(): Scene;

    protected getAssets() {
        
        if ( this.definition === undefined )
            this.definition = this.getAssetsDefinition();

        return this.definition;
    }

    async inAlone() {
        this.hasSpace = true;
        this.bundle.borders.setClosedProperties();
        return this.load()
            .then( () => this.show() );
    }

    async out() {
        this.bundle.borders.setClosedProperties();
        return this.deactivate()
            .then( () => this.hide() )
            .then( () => this.destroy() );
    }

    async outTo( screen: GameScreen ) {
        
        this.bundle.borders.setClosedProperties();

        return this.deactivate()
            .then( () => this.hide() )
            .then( () => this.deactivate() )
            .then( () => screen.load() )
            .then( () => screen.sleep( 2000 ) )
            .then( () => screen.show() )
            .then( () => this.destroy() )
    }

    protected onInit(): void {

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

    public async load() {
        return this.bundle.load().then( () => {
            this.loaded = true;
        });
    }

    sleep(ms:number) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    protected onActivate(): void {

        this.bundle.borders.appendImages();
        this.bundle.borders.setOpenProperties();
    }

    protected async onDeactivate(): Promise<GameObject> {
        this.bundle.borders.setClosedProperties();
        return this;
    }
    
}