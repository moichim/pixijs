import { Assets, Resource, Texture } from "pixi.js";
import { agents, layers } from "./Bundle";
import { Layer } from "./Scopes";


type Land = {
    role: typeof layers[number],
    file: Texture<Resource>
}


type LandSelection = {
    [A in typeof layers[number]]?: string
}

type AgentSelection = {
    big: {
        [ B in typeof agents["big"][number] ]?: string
    },
    small: {
        [ B in typeof agents["small"][number] ]?: string
    }
}

type LayerSelection = {
    lands: LandSelection,
    agents: AgentSelection
}

export class LayerAssets {

    selections: LayerSelection = {
        lands: {},
        agents: {
            big: {},
            small: {}
        }
    }

    lands: {
        [A in typeof layers[number]]?: Land
    } = {}

    protected buffer: {
        land: ( typeof layers[number] )[],
        agents: {
            big: ( typeof agents["big"][number] )[],
            small: ( typeof agents["small"][number] )[]
        } 
    }   = {
        land: [],
        agents: {
            big: [],
            small: []
        }
    }

    constructor(
        public readonly definition: Layer
    ) {
        
    }

    

    getAgentBig( agent: typeof agents["big"][number] ) {
        const scope = this.selections.agents["big"][agent];
        const key = `${agent}___${scope}`;

        return {
            texture: Assets.get( key ),
            scope: scope
        }
    }

    
    getAgentSmall( agent: typeof agents["small"][number] ) {
        const scope = this.selections.agents["small"][agent];
        const key = `${agent}___${scope}`;

        return {
            texture: Assets.get( key ),
            scope: scope
        }
    }

    getLand( land: typeof layers[number] ) {

        const scope = this.selections.lands[land];

        return {
            texture: Assets.get(scope as string),
            scope: scope
        }

    }

    getRandomLand(): ReturnType<LayerAssets["getLand"]> {

        // Sarch from lands that were not selected yet

        // If empty, clear the buffer and search again

        let selection: false|(typeof layers[number]) = false;
        

        const options = Object.values( layers )
            .filter( ( layer ) => ! this.buffer.land.includes( layer as typeof layers[number]) )

        if ( options.length === 0 ) {
            this.buffer.land = [];
        }
        
        else if ( options.length === 1 ) {
            selection = options[0] as typeof layers[number];
        }

        else {
            selection = options[ Math.floor( Math.random() * options.length ) ] as typeof layers[number];
        }

        console.log( "Vybral jsem", selection );

        if ( selection ) {
            this.buffer.land.push( selection );
            return this.getLand( selection );
        }

        return this.getRandomLand();

    }

}