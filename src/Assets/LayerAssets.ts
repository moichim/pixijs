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
        const key = `${land}___${scope}`;

        return {
            texture: Assets.get(key),
            scope: scope
        }

    }

}