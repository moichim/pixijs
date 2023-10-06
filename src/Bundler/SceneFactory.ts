import { assets } from "../main";

type Slot = {
    x: number,
    y: number,
    rotation: number
}

export type SimpleFileDefinition = { bundle: string, role: string }

export class LayerDefinition {

    agents: Map<string,SimpleFileDefinition> = new Map;
    slots: Slot[] = [];

    constructor(
        public readonly depth: number,
        public readonly bundle: string,
        public readonly land: string,
        public readonly shift?: {x?:number,y?:number}
    ) {
        this.setAgent( "agent_1_small", this.bundle )
            .setAgent( "agent_2_small", this.bundle )
            .setAgent( "agent_3_small", this.bundle )
            .setAgent( "agent_1_big", this.bundle )
            .setAgent( "agent_2_big", this.bundle )
            .setAgent( "agent_3_big", this.bundle );
    }

    addSlot( x: number, y: number, rotation: number ) {
        this.slots.push({
            x, y, rotation
        });
        return this;
    }

    setAgent( role: string, bundle?: string ) {
        this.agents.set(role, { bundle: bundle ?? this.bundle, role });
        return this;
    }

    getRequest(): SimpleFileDefinition[] {
        return [
            ...Array.from( this.agents.values() ),
            { bundle: this.bundle, role: this.land }
        ]
    }

    getResult() {
        return {
            depth: this.depth,
            land: assets.getFile( this.bundle, this.land ),
            shift: this.shift,
            agents: {
                agent_1: assets.getFile( 
                    this.agents.get( "agent_1_small" )!.bundle, 
                    this.agents.get( "agent_1_small" )!.role 
                ),
                agent_2: assets.getFile( 
                    this.agents.get( "agent_2_small" )!.bundle, 
                    this.agents.get( "agent_2_small" )!.role 
                ),
                agent_3: assets.getFile( 
                    this.agents.get( "agent_3_small" )!.bundle, 
                    this.agents.get( "agent_3_small" )!.role 
                ),
                agent_4: assets.getFile( 
                    this.agents.get( "agent_1_big" )!.bundle, 
                    this.agents.get( "agent_1_big" )!.role 
                ),
                agent_5: assets.getFile( 
                    this.agents.get( "agent_2_big" )!.bundle, 
                    this.agents.get( "agent_2_big" )!.role 
                ),
                agent_6: assets.getFile( 
                    this.agents.get( "agent_3_big" )!.bundle, 
                    this.agents.get( "agent_3_big" )!.role 
                )
            }
        }
    }


}


export class SceneFactory {

    layers: Map<number,LayerDefinition> = new Map;

    constructor(
        public readonly defaultBundle: string
    ) {

    }

    colors = {
        primary: 0xff0000,
        highlight: 0xffff00
    }

    setColors( primary: number, highlight: number ) {
        this.colors.primary = primary;
        this.colors.highlight = highlight;
    }

    addLayer( depth: number, land: string, bundle?: string, shift?: {x?:number,y?:number} ) {

        const layer = new LayerDefinition( depth, bundle ?? this.defaultBundle, land, shift );

        this.layers.set( depth, layer );

        return layer;

    }

    getResult() {
        return {
            colors: this.colors,
            layers: Array.from( this.layers.values() ).map( l => l.getResult() )
        }
    }

    async load() {

        let files: SimpleFileDefinition[] = [];

        // Add layer files
        this.layers.forEach( layer => {
            const f = layer.getRequest();

           files = [ ...files, ...f ];

        } );

        return assets.request().addFilesRequest( ...files ).loadRegisteredAssets().then(() => this.getResult());

    }

}