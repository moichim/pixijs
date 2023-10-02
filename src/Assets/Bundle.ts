import { Assets } from "pixi.js";
import { GameScreen } from "../structure/Screen/GameScreen";
import { Borders } from "./Borders";
import { LayerAssets } from "./LayerAssets";
import { Scene, SelectableScope } from "./Scopes";

export const agents = {
    big: ["agent_1_big","agent_2_big","agent_3_big"] as ("agent_1_big"|"agent_2_big"|"agent_3_big")[],
    small: ["agent_1_small","agent_2_small","agent_3_small"] as ("agent_1_small"|"agent_2_small"|"agent_3_small")[]
}

export const layers = ["layer_1","layer_2","layer_3","layer_4","layer_5"] as ("layer_1"|"layer_2"|"layer_3"|"layer_4"|"layer_5")[];

export const borders = ["border_top","border_left","border_right","border_bottom"] as ("border_top"|"border_left"|"border_right"|"border_bottom")[];

type BundleRequest = {
    bacgkround: string,
} & {
    [index: string]: string // Transitions are named individually
} & {
    [ T in typeof layers[number] ]: string
} & {
    [ T in typeof borders[number] ]: string
} & {
    [ T in typeof agents["big"][number] ]: string
} & {
    [ T in typeof agents["small"][number] ]: string
}

export class Bundle {

    protected ids: string[] = [];

    public readonly layers: LayerAssets[] = [];

    public readonly borders: Borders = new Borders;

    constructor(
        protected readonly definition: Scene,
        protected readonly gameScreen: GameScreen
    ) {
        this.registerRequests( definition );
    }

    protected pickScope( scope: SelectableScope ) {
        if ( Array.isArray( scope ) ) {
            return scope[ Math.floor( Math.random() * scope.length ) ];
        }
        return scope;
    }

    protected registerRequests(  definition: Scene ) {


        // Calculate scope for the background
        this.registerRequest( "bacgkround", definition.background, "bg.jpg" );
        
        // Load all layers
        for ( let layer of definition.layers ) {

            const layerAssets = new LayerAssets( layer );

            this.layers.push( layerAssets );

            // Load lands
            for ( let l of layers ) {
                const result = this.registerRequest( 
                    l, 
                    layer.land, 
                    `${l}.png`
                )

                layerAssets.selections.lands[ result.usage as typeof layers[number] ] = result.key;
            }

            // Load agents

            for ( let a of agents["small"] ) {
                const result = this.registerRequest( 
                    a, 
                    layer.agents, 
                    `${a}.png`
                );

                layerAssets.selections.agents.small[ result.usage as typeof agents["small"][number] ] = result.key;
            }

            for ( let a of agents["big"] ) {
                const result = this.registerRequest( 
                    a, 
                    layer.agents, 
                    `${a}.png`
                );
                layerAssets.selections.agents.big[ result.usage as typeof agents["big"][number] ] = result.key;
            }

        }

        // Load borders
        for ( let b of borders ) {
            const result = this.registerRequest( 
                b, definition.borders, `${b}.png`
            );
            this.borders.addBorder( result );
        }

        // Load the transitions
        if ( Array.isArray( definition.transitions ) ) {

            for ( let variant of definition.transitions ) {
                const result = this.registerRequest( `transition_${variant}`, variant, "transition.png" );
                this.borders.addTransition( result );
            }

        } else {
            const result = this.registerRequest( `transition_${definition.transitions}`, definition.transitions, "transition.png" );
            this.borders.addTransition( result );
        }

        this.borders.init();

        this.ids.sort();

    }

    protected registerRequest( 
        usage: keyof BundleRequest, 
        scope: SelectableScope, 
        file: string
    ) {

        const s = this.pickScope( scope );

        const key = `${usage}___${s}`;

        const f = `raw-assets/bundles/${s }/${file}`;

        if ( ! this.ids.includes( key ) ) {

            this.ids.push( key );

            Assets.add(
                key,
                f
            );

        }

        return {
            usage: usage,
            scope: s,
            key: key,
            file: f
        }

        
    }

    public async load() {
        return await Assets.load( this.ids ).then( (result) => {

            console.info( "Assets loaded!", result );

            return this;

        } );


    }

    public resetMasks() {
        this.borders.setinitialProperties();
        this.borders.appendImages();
    }

}