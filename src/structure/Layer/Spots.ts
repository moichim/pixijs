import { LayerSpotMeta } from "../../Assets/Manifest/Builders";
import { ParallaxScene } from "../../scenes/ParallaxScene";
import { ContainerGameObject } from "../ContainerGameObject";
import { LayerDefinition } from "../Screen/SceneFactory";
import { Spot } from "./Spot";

export class Spots extends ContainerGameObject {

    declare parent: ParallaxScene;

    declare children: Spot[];

    protected spots: Spot[] = [];

    public set size( value: number ) {
        this.children.map( spot => spot.scale.set( value ) );
    }

    public constructor( 
        public readonly definition: ReturnType<LayerDefinition["getResult"]>,
        public readonly colors: any
    ) {
        super();
    }

    public static fromMiddle( 
        definition: ReturnType<LayerDefinition["getResult"]>,
        colors: any
    ): Spots
    {
        const item = new Spots( definition, colors );
        item.pivot.set( .5 );
        item.x = 0;
        item.y = 0;
        return item;
    }

    public buildSpots() {

        if ( this.definition.land ) {

            if ( this.definition.land.data ) {
                if ( "spots" in this.definition.land.data ) {
                    const s = this.definition.land.data.spots as LayerSpotMeta[];

                    s.forEach( spot => {
                        const sp = new Spot( spot.x, spot.y, spot.rotation );
                        this.addGameObject( sp );
                        this.spots.push( sp );
                    } )

                }
            }

        }

    }

    protected getFreeSpots() {
        return this.spots.filter( spot => spot.isFree() );
    }


    public hasFreeSpots() {
        return this.getFreeSpots().length > 0;
    }

    protected selectFreeSpot(): Spot {
        const spots = this.getFreeSpots();
        return spots[ Math.floor( Math.random() * spots.length ) ];
    }

    protected selectAgent() {
        const agents = this.definition.agents;

            const agent = Array.from( Object.values( agents ) );

            return agent[ Math.abs( Math.floor( Math.random() * agent.length ) ) ];
    }

    public addAgent() {

        if ( this.hasFreeSpots() ) {

            const spot = this.selectFreeSpot();

            const agent = this.selectAgent();

            spot.addAgent( agent!, this.colors );

        }

    }


}